<template>
  <div class="detail-wrapper">
    <div class="header-wrapper">
      <div class="app-name">{{ detailData.serviceName }}</div>
      <div class="detail-header">
        <div class="form-wrapper">
          <el-form :inline="true" label-position="left" label-width="120px" class="custom-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="来源系统">{{ detailData.systemName }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="归属部门">{{ detailData.deptName }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属项目">{{ detailData.proName }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负 责 人">{{ detailData.technicalContact }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式">{{ detailData.telephone }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="status-wrapper">
          <div class="label-text">状态</div>
          <div class="label-status" :style="{color: statusMap.get(Number(detailData.orderStatus))['color']}">
            <div>
              <icon-svg name="status9" style="width: 24px; height: 24px;"></icon-svg>
            </div>
            <div style="margin-left: 12px;">
              <span>{{ statusMap.get(Number(detailData.orderStatus))['text'] }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-approve">
        <div class="approve-wrapper">
          <div class="approve-item" v-for="(item, index) in approverNodeList" :key="index">
            <div class="item-top">
              <div class="item-icon">
                <icon-svg :name="item.svg" class="icon-svg" :class="calculateIconActiveClass(index)"></icon-svg>
              </div>
              <div class="item-text">{{ item.title }}</div>
              <div class="item-line" v-if="index !== approverNodeList.length - 1" :class="calculateLineActiveClass(index + 1)"></div>
            </div>
            <div class="item-bottom">
              <template v-if="item.approveInfo.approverTime">
                <div class="item-time">
                  <div class="time-tag" v-if="item.approveInfo.approverStatus !== undefined" :class="[item.approveInfo.approverStatus === 0 ? 'tag-rejected' : '']">{{ item.approveInfo.approverResult }}</div>
                  <div> {{ item.approveInfo.approverTime }}</div>
                </div>
                <div class="item-dept">{{ item.approveInfo.approverDept }}</div>
                <div class="item-text">{{ `${index === 0 ? '申请人：' : '审理人：'} ${item.approveInfo.approverName}  ${item.approveInfo.approverPhone}` }}</div>
                <div class="item-text">
                  <span v-if="index !== 0 && ((index !== approverNodeList.length - 1 && detailData.serviceType === '1') || detailData.serviceType === '2')">{{ `审理意见：${item.approveInfo.approverOpinion }`}}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="applyer-wrapper">
        <second-title title="申请人信息" :show-block="true" :show-border="false"></second-title>
        <el-form label-position="left" label-width="120px" class="custom-form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="申 请 人">{{ detailData.proposerName }}</el-form-item>
              <el-form-item label="申请部门">{{ detailData.applyDeptName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系方式">{{ detailData.proposerPhone }}</el-form-item>
              <el-form-item label="申请日期">{{ dayjs(detailData.applyTime).format('YYYY-MM-DD HH:mm') }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="config-wrapper">
        <second-title title="配置信息" :show-block="true" :show-border="false"></second-title>
        <el-form label-position="left" label-width="120px" class="custom-form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="使用系统">{{ detailData.applicationName }}</el-form-item>
            </el-col>
            <template v-if="detailData.serviceType === '1'">
              <el-col :span="8">
                <el-form-item label="业务负责人">{{ `${detailData.serverCharge} ${detailData.serverChargePhone}` }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="技术负责人">{{ `${detailData.tecCharge}  ${detailData.tecChargePhone}` }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用频率">{{ `每天不超过${detailData.transferDay}次，每月不超过${detailData.transferMonth}次` }}</el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="相关附件">
                  <template v-if="detailData.fileDoc.length">
                    <span style="color: rgba(20, 146, 255, 1); cursor: pointer;">{{ detailData.fileDoc[0].fileName }}</span>
                    <el-button type="primary" plain size="small" @click="downloadFileHandle(detailData.fileDoc[0].filePath, detailData.fileDoc[0].fileName)" style="margin-left: 32px;">
                      <el-icon><download></download></el-icon>
                      下载附件
                    </el-button>
                  </template>
                  <template v-else>暂无附件</template>
                </el-form-item>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="16">
                <el-form-item label="申请事由">{{ detailData.applyReason }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务负责人">{{ `${detailData.serverCharge} ${detailData.serverChargePhone}` }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用期限">{{ detailData.useTerm }}</el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'

import { getApproveDetailApi } from '@/api/approve-api'
import { downloadFileByUrl } from '@/utils'

export default {
  name: 'apply-detail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const statusMap = new Map([
      [1, { text: '通过', color: 'rgba(21, 190, 80, 1)' }],
      [9, { text: '审批中', color: 'rgba(255, 95, 0, 1)' }],
      [6, { text: '已下架', color: 'rgba(0, 52, 255, 1)' }],
      [0, { text: '驳回', color: 'rgba(212, 0, 0, 1)' }]
    ])

    let detailData = reactive({
      serviceName: '',
      systemName: '',
      deptName: '',
      proName: '',
      technicalContact: '',
      telephone: '',
      orderStatus: null,
      proposerName: '',
      proposerPhone: '',
      applyDeptName: '',
      applyTime: '',
      applyReason: '',
      applicationName: '',
      businessOwner: '',
      businessOwnerContact: '',
      tecCharge: '',
      transferDay: '',
      transferMonth: '',
      fileDoc: '',
      useTerm: '',
      serviceType: ''
    })
    // 审批节点列表
    const approverNodeList = ref([
      {
        svg: 'launch',
        title: '发起申请',
        approveInfo: {}
      },
      {
        svg: 'approve',
        title: '申请方负责人审理',
        approveInfo: {}
      },
      {
        svg: 'approve',
        title: detailData.serviceType === '1' ? '提供方负责人审理' : '数管局负责人审批',
        approveInfo: {}
      },
      {
        svg: 'approve',
        title: detailData.serviceType === '1' ? '提供方开发商审理' : '数据运营团队审批',
        approveInfo: {}
      }
    ])

    const getDetailHandle = (id) => {
      getApproveDetailApi({ id }).then(({ data }) => {
        const { serviceInfo, serviceApplyInfo } = data
        const { fileDoc, applyTime, proposerName, proposerPhone, applyDeptName,
          serverCharge, serverChargePhone, serverChargeDeptName, serverApprovalTime, serverApprovalOpinion, serverApprovalResult,
          approvalTime, approverName, approvalPhone, approvalOpinion, approvalResult, approvalDeptName,
          rsApprovalTime, rsApprovalResult, rsApproverName, rsApprovalPhone, rsApproverDeptName } = serviceApplyInfo ? serviceApplyInfo : {}
        detailData = Object.assign(detailData, serviceInfo, serviceApplyInfo)
        detailData.fileDoc = JSON.parse(fileDoc)
        // 发起申请节点
        approverNodeList.value[0].approveInfo = Object.assign(approverNodeList.value[0].approveInfo, {
          approverTime: dayjs(applyTime).format('YYYY-MM-DD HH:mm:ss'),
          approverName: proposerName,
          approverPhone: proposerPhone,
          approverResult: undefined,
          approverStatus: undefined,
          approverOpinion: undefined,
          approverDept: applyDeptName
        })
        // 申请方负责人审理节点
        approverNodeList.value[1].approveInfo = Object.assign(approverNodeList.value[1].approveInfo, {
          approverTime: serverApprovalTime ? dayjs(serverApprovalTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
          approverName: serverCharge,
          approverPhone: serverChargePhone,
          approverResult: serverApprovalResult === 1 ? '通过' : '驳回',
          approverStatus: serverApprovalResult,
          approverOpinion: serverApprovalOpinion,
          approverDept: serverChargeDeptName
        })

        // 提供方负责人审理节点
        approverNodeList.value[2].approveInfo = {
          approverTime: approvalTime ? dayjs(approvalTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
          approverName: approverName,
          approverPhone: approvalPhone,
          approverResult: approvalResult === 1 ? '通过' : '驳回',
          approverStatus: approvalResult,
          approverOpinion: approvalOpinion,
          approverDept: approvalDeptName
        }

        // 提供方开发商审理节点节点
        approverNodeList.value[3].approveInfo = {
          approverTime: rsApprovalTime ? dayjs(rsApprovalTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
          approverName: rsApproverName,
          approverPhone: rsApprovalPhone,
          approverResult: rsApprovalResult === 1 ? '通过' : '驳回',
          approverStatus: rsApprovalResult,
          approverOpinion: undefined,
          approverDept: rsApproverDeptName
        }
      })
    }
    getDetailHandle(props.id)

    const downloadFileHandle = (fileUrl, fileName) => {
      downloadFileByUrl(fileUrl, fileName)
    }

    const calculateIconActiveClass = (index) => {
      return approverNodeList.value[index].approveInfo.approverTime ? (approverNodeList.value[index].approveInfo.approverStatus === 1 ? 'icon-active' : 'icon-rejected') : ''
    }

    const calculateLineActiveClass = (index) => {
      return approverNodeList.value[index].approveInfo.approverTime ? (approverNodeList.value[index].approveInfo.approverStatus === 1 ? 'line-active' : 'line-rejected') : ''
    }

    return {
      dayjs,
      statusMap,
      detailData,
      approverNodeList,
      downloadFileHandle,
      calculateIconActiveClass,
      calculateLineActiveClass
    }
  }
}
</script>

<style scoped lang="scss">
.detail-wrapper {
  .header-wrapper {
    padding: 24px 32px 16px 32px;
    border-radius: 4px;
    margin-bottom: 16px;
    background-color: rgba(255, 255, 255, 1);

    .app-name {
      padding: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      line-height: 20px;
      font-family: PingFangSC-Semibold;
    }

    .detail-header {
      display: flex;

      .form-wrapper {
        width: 100%;
      }

      .status-wrapper {
        width: 220px;

        .label-text {
          height: 40px;
          line-height: 40px;
          color: rgba(102, 102, 102, 1);;
        }

        .label-status {
          display: flex;
          font-size: 20px;
          font-weight: 600;
          font-family: PingFangSC-Semibold;
        }
      }
    }

    .detail-approve {

      .approve-wrapper {
        display: flex;
        padding: 0 120px;

        .approve-item {
          width: 25%;

          .item-top {
            display: flex;
            align-items: center;
            height: 50px;
            line-height: 50px;

            .item-icon {
              width: 50px;
              height: 50px;
              margin-right: 4px;

              .icon-svg {
                font-size: 50px;
                color: rgba(201, 203, 205, 1);
              }

              .icon-active {
                color: rgba(20, 146, 255, 1);
              }

              .icon-rejected {
                color: rgba(212, 0, 0, 1);
              }
            }

            .item-text {
              font-size: 14px;
              color: #333333;
              line-height: 14px;
              font-weight: 600;
              font-family: PingFangSC-Semibold;
            }

            .item-line {
              flex: 1;
              height: 4px;
              width: 100%;
              background-color: rgba(201, 203, 205, 1);
            }

            .line-active {
              background-color: rgba(20, 146, 255, 1);
            }

            .line-rejected {
              background-color: rgba(212, 0, 0, 1);
            }
          }

          .item-bottom {
            margin-left: 56px;

            .item-time {
              display: flex;
              margin: -10px 0 0 0;
              line-height: 12px;
              font-size: 12px;
              font-weight: 400;
              color: #999999;
              font-family: PingFangSC-Regular;

              .time-tag {
                height: 14px;
                margin-right: 8px;
                padding: 0 8px;
                color: rgba(20, 146, 255, 1);
                background-color: rgba(20, 146, 255, 0.2);
                border-radius: 2px;
                border: 1px solid rgba(20, 146, 255, 0.5);
              }

              .tag-rejected {
                height: 14px;
                margin-right: 8px;
                padding: 0 8px;
                color: rgba(212, 0, 0, 1);
                background-color: rgba(212, 0, 0, 0.2);
                border-radius: 2px;
                border: 1px solid rgba(212, 0, 0, 0.5);
              }
            }

            .item-dept {
              height: 14px;
              line-height: 14px;
              margin: 12px 0;
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              font-family: PingFangSC-Regular;
            }

            .item-text {
              height: 14px;
              line-height: 14px;
              margin-bottom: 12px;
              font-size: 14px;
              color: #999999;
              font-weight: 400;
              font-family: PingFangSC-Regular;
            }
          }
        }
      }
    }
  }

  .content-wrapper {
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);

    .applyer-wrapper {
      border-bottom: 1px solid rgba(238, 238, 238, 1);

      .custom-form {
        padding: 0 24px 22px 24px;
      }
    }

    .config-wrapper {

      .custom-form {
        padding: 0 24px 22px 24px;
      }
    }
  }
}
</style>
