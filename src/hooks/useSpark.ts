import CryptoJS from "crypto-js";
const httpUrl = new URL("wss://spark-api.xf-yun.com/v1.1/chat");
const modelDomain = "general";
const getWebsocketUrl = (apiKey:string, apiSecret:string) => {
  return new Promise<string>((resolve, reject) => {
    try {
      let url = "wss://" + httpUrl.host + httpUrl.pathname;
      const host = location.host;
      const date = new Date().toUTCString();
      const algorithm = "hmac-sha256";
      const headers = "host date request-line";
      const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${httpUrl.pathname} HTTP/1.1`;
      const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
      const signature = CryptoJS.enc.Base64.stringify(signatureSha);
      const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
      console.log(authorizationOrigin);
      
      const authorization = btoa(authorizationOrigin);
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};
export type StatusChangeHandler = (oldStatus: string, newStatus: string) => any;
class SparkBigModel {
  status: string;
  onWillStatusChange?: StatusChangeHandler;
  wss?: WebSocket;
  playTimeout?: NodeJS.Timeout;
  uid: string;
  answer: Ref<string>;
  appId = '';
  constructor(
    public content: string,
    public question: string,
    answerRef: Ref<string>,
    statusChangeHandler?: StatusChangeHandler,
    uid = "fd3f47e4-d"
  ) {
    this.onWillStatusChange = statusChangeHandler;
    this.status = "init";
    this.uid = uid;
    this.answer = answerRef;
  }

  // 修改状态
  setStatus(status: string) {
    this.onWillStatusChange && this.onWillStatusChange(this.status, status);
    this.status = status;
  }

  // 连接websocket
  async connectWebSocket() {
    const {
      APP_ID,
      API_KEY,
      API_SECRET
    } = await invokeBaseApi.getSparkInfo();
    this.appId = APP_ID;
    this.setStatus("running");
    const url = await getWebsocketUrl(API_KEY, API_SECRET);
    const wss = new WebSocket(url);
    this.wss = wss;
    wss.onopen = (_) => {
      this.webSocketSend();
    };
    wss.onmessage = (e) => {
      this.result(e.data);
    };
    wss.onerror = (e) => {
      clearTimeout(this.playTimeout);
      this.setStatus("error");
      console.error(e);
    };
    wss.onclose = (e) => {
      console.log(e);
    };
  }

  // websocket发送数据
  webSocketSend() {
    const params = {
      header: {
        app_id: this.appId,
        uid: this.uid,
      },
      parameter: {
        chat: {
          domain: modelDomain,
          temperature: 0.1,
          top_k: 1,
          max_tokens: 4096,
        },
      },
      payload: {
        message: {
          text: [
            {
              role: "system",
              content: this.content,
            },
            {
              role: "user",
              content: this.question,
            },
          ],
        },
      },
    };
    this.wss?.send(JSON.stringify(params));
  }

  start() {
    this.answer.value = "";
    this.connectWebSocket();
  }

  // websocket接收数据的处理
  result(resultData: string) {
    let jsonData = JSON.parse(resultData);

    this.answer.value +=
      jsonData?.payload?.choices.text.map((i: any) => i.content).join() || "";
    // 提问失败
    if (jsonData.header.code !== 0) {
      console.error(`${jsonData.header.code}:${jsonData.header.message}`);
      return;
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      this.wss?.close();
      this.setStatus("init");
    }
  }
}

export const useSpark = () => {
  const answer = ref("");
  const loading = ref(false);
  const start = (content: string, question: string) => {
    const spark = new SparkBigModel(
      content,
      question,
      answer,
      (_, newStatus: string) => {
        loading.value = newStatus === "running";
      }
    );
    spark.start();
  };
  return [answer, loading, start] as [
    Ref<string>,
    Ref<boolean>,
    (content: string, question: string) => void
  ];
};
