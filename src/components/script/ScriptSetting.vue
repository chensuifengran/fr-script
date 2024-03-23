<template>
  <div class="script-setting-div">
    <el-page-header @back="goBack" class="header" title="脚本列表">
      <template #content>
        <div class="title-content">
          <span>设置</span>
          <el-tag type="info" class="ml-10" size="small">{{
            targetIndex !== -1 ? scriptList[targetIndex].name : "出现问题，请联系开发者"
          }}</el-tag>
        </div>
      </template>
      <template #extra>
        <div class="title-end">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="编辑脚本"
            placement="bottom"
          >
            <el-icon class="icon" @click.stop="editorScriptFile"><IEpEdit /></el-icon>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="运行脚本"
            placement="bottom"
          >
            <el-icon class="icon" @click.stop="runScript"><IEpSwitchButton /></el-icon>
          </el-tooltip>
        </div>
      </template>
    </el-page-header>
    <div class="script-setting">
      <h4 class="ml-0">初始化表单后(运行脚本前)</h4>
      <ScriptSettingItem
        label="自动导入上次运行配置"
        alert="开启后，在脚本初始化之后自动恢复上次运行脚本时各表单项的值或选项"
      >
        <el-switch
          v-model="scriptList[targetIndex].setting.autoImportLastRunConfig"
        ></el-switch>
      </ScriptSettingItem>
      <ScriptSettingItem
        label="自动启动目标应用"
        alert="开启后，在脚本初始化之后自动启动下方的【目标应用】（若有）"
      >
        <el-switch
          v-model="scriptList[targetIndex].setting.autoStartTargetApp"
        ></el-switch>
      </ScriptSettingItem>
      <ScriptSettingItem
        v-show="scriptList[targetIndex].setting.autoStartTargetApp"
        label="目标应用"
        alert="选项【自动启动目标应用】启动的目标,填写指导请点击输入框右边问号"
      >
        <el-input
          v-model="scriptList[targetIndex].setting.targetApp"
          placeholder="输入目标应用启动的目标"
        >
          <template #append>
            <el-button size="small" circle class="question-button">
              <el-icon :size="20" @click="drawer = true"><IEpQuestionFilled /></el-icon>
            </el-button>
          </template>
        </el-input>
      </ScriptSettingItem>
      <h4 class="ml-0">运行脚本时</h4>
      <ScriptSettingItem
        label="自动连接目标设备"
        alert="选择后，运行脚本时，ADB将连接至该设备,并与其它设备断开连接"
      >
        <el-select
          v-model="scriptList[targetIndex].setting.targetAdbDevice"
          class="target-device"
          size="small"
          filterable
          allow-create
          default-first-option
          clearable
          :reserve-keyword="false"
          placeholder="选择或输入设备地址，如：127.0.0.1:21503"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </ScriptSettingItem>
      <ScriptSettingItem
        label="主动断开的设备"
        alert="当ADB无法发现该设备,添加该设备在目标设备连接之前自动断开连接"
      >
        <div>
          <el-tag
            v-for="tag in scriptList[targetIndex].setting.excludeDevice"
            :key="tag"
            class="mr-10"
            closable
            type="info"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="tag-input"
            size="small"
            @keyup.enter="handleInputConfirm(true)"
            @blur="handleInputConfirm(false)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 排除的设备
          </el-button>
        </div>
      </ScriptSettingItem>
    </div>
  </div>
  <el-drawer v-model="drawer" title="获取目标应用指南" direction="rtl" size="70%">
    <el-steps :active="active" finish-status="success">
      <el-step title="1.导出快捷方式" />
      <el-step title="2.复制目标" />
    </el-steps>
    <el-button-group>
      <el-button @click="preStep">上一步</el-button>
      <el-button @click="nextStep">下一步</el-button>
    </el-button-group>

    <div class="guide">
      <div v-show="active === 1">
        <h3>1.导出快捷方式</h3>
        <div>
          打开模拟器，长按图标，点击 <el-tag size="default" type="info">发送到</el-tag>
        </div>
        <img src="../../assets/sendTo.png" alt="" srcset="" />
        <div>选择 <el-tag size="default" type="info">添加电脑桌面快捷方式</el-tag></div>
        <img src="../../assets/exportApp.png" alt="" srcset="" />
      </div>
      <div v-show="active === 2">
        <h3>2.复制目标</h3>
        <div>
          在桌面找到导出的快捷方式，右击
          <el-tag size="default" type="info">属性</el-tag>-<el-tag
            size="default"
            type="info"
            >快捷方式</el-tag
          >-<el-tag size="default" type="info">目标</el-tag>
        </div>
        <div>全选<el-tag size="default" type="info">目标</el-tag>编辑框的内容，复制</div>
        <img src="../../assets/target.png" alt="" srcset="" />
        <div>复制完成后粘贴到本输入框即可完成设置</div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ElInput } from "element-plus";
import { storeToRefs } from "pinia";
import { devicesFn } from "../../invokes/devices/exportFn";
const drawer = ref(false);
const active = ref(1);
const nextStep = () => {
  if (active.value++ > 1) active.value = 1;
};
const preStep = () => {
  if (active.value > 1) active.value--;
};

const goBack = () => {
  router.replace({
    path: "/script/list",
  });
};
const targetIndex = ref(-1);
const { openId, contentTransform, asideBarPos } = useScriptInfo();
const listStore = useListStore();
const { scriptList, deviceList } = storeToRefs(listStore);
const options = deviceList.value.map((item) => ({
  label: item,
  value: item,
}));
onMounted(() => {
  devicesFn();
});
watchEffect(() => {
  if (openId.value === "-1") return;
  const target = scriptList.value.find((item) => item.id === openId.value);
  if (!target?.setting) {
    target!.setting = {
      autoImportLastRunConfig: false,
      targetAdbDevice: "",
      excludeDevice: [],
      targetApp: "",
      autoStartTargetApp: false,
    };
  }
  targetIndex.value = scriptList.value.findIndex((item) => item.id === openId.value);
});
const InputRef = ref<InstanceType<typeof ElInput>>();
const inputVisible = ref(false);
const inputValue = ref("");
const handleClose = (tag: string) => {
  const dynamicTags = scriptList.value[targetIndex.value].setting.excludeDevice;
  dynamicTags.splice(dynamicTags.indexOf(tag), 1);
};
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = (focus: boolean) => {
  const dynamicTags = scriptList.value[targetIndex.value].setting;

  if (inputValue.value) {
    if (dynamicTags.excludeDevice) {
      dynamicTags.excludeDevice.push(inputValue.value);
    } else {
      dynamicTags.excludeDevice = [inputValue.value];
    }
  }
  inputValue.value = "";
  if (!focus) {
    inputVisible.value = false;
  }
};
const editorScriptFile = () => {
  contentTransform.value = "translateX(-100%)";
  asideBarPos.value = "absolute";
  router.replace("/script/editor");
};
const runScript = () => {
  router.replace("/script/run");
};
</script>
<style lang="scss">
.script-setting-div {
  .header {
    .v-center {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        font-size: 15px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.ml-0 {
  margin-left: 0;
}
.target-device {
  width: 300px;
}
.question-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.ml-10 {
  margin-left: 10px;
}
.script-setting-div {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  .title-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .title-end {
    display: flex;
    flex-direction: row;
    align-items: center;
    .icon {
      cursor: pointer;
      font-size: 20px;
      margin-left: 10px;
      &:hover {
        color: #05d74e;
      }
    }
  }
  .header {
    padding: 10px;
  }
  .script-setting {
    padding: 10px;
    padding-top: 0;
    border-radius: 10px;
  }
}
.mr-10 {
  margin-right: 10px;
}
.button-new-tag,
.tag-input {
  width: 130px;
}
</style>
