import React from 'react';
import PropTypes from 'prop-types';
import { ModelVersionTable } from './ModelVersionTable';
import PermissionUtils from '../../utils/PermissionUtils';
import Utils from '../../utils/Utils';
import { Link } from 'react-router-dom';
import { modelListPageRoute } from '../routes';
import { Radio, Icon, Descriptions, Menu, Dropdown, Modal, Tabs, Tooltip } from 'antd';
import {
  ACTIVE_STAGES,
  REGISTERED_MODEL_DELETE_MENU_ITEM_DISABLED_TOOLTIP_TEXT,
} from '../constants';
import { CollapsibleSection } from '../../common/components/CollapsibleSection';
import { EditableNote } from '../../common/components/EditableNote';
import ServingPane from "../../model-serving/components/ServingPane";

const TabPane = Tabs.TabPane;

export const StageFilters = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
};

export class ModelView extends React.Component {
  static propTypes = {
    model: PropTypes.shape({
      name: PropTypes.string.isRequired,
      creation_timestamp: PropTypes.number.isRequired,
      last_updated_timestamp: PropTypes.number.isRequired,
      permission_level: PropTypes.string.isRequired,  // databricks-only
    }),
    modelVersions: PropTypes.arrayOf(PropTypes.shape({
      current_stage: PropTypes.string.isRequired,
    })),
    handleEditDescription: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    // @Databricks handler for launching permission modal for registered model from Databricks
    showEditPermissionModal: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    stageFilter: StageFilters.ALL,
    showDescriptionEditor: false,
    isDeleteModalVisible: false,
    isDeleteModalConfirmLoading: false,
  };

  componentDidMount() {
    const pageTitle = `${this.props.model.name} - MLflow Model`;
    Utils.updatePageTitle(pageTitle);
  }

  handleStageFilterChange = (e) => {
    this.setState({ stageFilter: e.target.value });
  };

  getActiveVersionsCount() {
    const { modelVersions } = this.props;
    return modelVersions
      ? modelVersions.filter((v) => ACTIVE_STAGES.includes(v.current_stage)).length
      : 0;
  }

  handleCancelEditDescription = () => {
    this.setState({ showDescriptionEditor: false });
  };

  handleSubmitEditDescription = (description) => {
    return this.props
      .handleEditDescription(description)
      .then(() => {
        this.setState({ showDescriptionEditor: false });
      });
  };

  startEditingDescription = (e) => {
    e.stopPropagation();
    this.setState({ showDescriptionEditor: true });
  };

  renderBreadCrumbDropdown() {
    const menu = (
      <Menu>
        {this.getActiveVersionsCount() > 0 ?
          (
            <Menu.Item disabled className='delete'>
              <Tooltip title={REGISTERED_MODEL_DELETE_MENU_ITEM_DISABLED_TOOLTIP_TEXT}>
                Delete
              </Tooltip>
            </Menu.Item>
          ) : (
            <Menu.Item onClick={this.showDeleteModal} className='delete'>Delete</Menu.Item>
          )}
        {Utils.isAclCheckEnabledForModelRegistry() ? (
          <Menu.Item
            className='edit-permission'
            onClick={this.props.showEditPermissionModal}
          >
            Permissions
          </Menu.Item>
        ) : null}
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']} className='breadcrumb-dropdown'>
        <Icon type='caret-down' className='breadcrumb-caret'/>
      </Dropdown>
    );
  }

  showDeleteModal = () => {
    this.setState({ isDeleteModalVisible: true });
  };

  hideDeleteModal = () => {
    this.setState({ isDeleteModalVisible: false });
  };

  showConfirmLoading = () => {
    this.setState({ isDeleteModalConfirmLoading: true });
  };

  hideConfirmLoading = () => {
    this.setState({ isDeleteModalConfirmLoading: false });
  };

  handleDeleteConfirm = () => {
    const { history } = this.props;
    this.showConfirmLoading();
    this.props
      .handleDelete()
      .then(() => {
        history.push(modelListPageRoute);
      })
      .catch((e) => {
        this.hideConfirmLoading();
        Utils.logErrorAndNotifyUser(e);
      });
  };

  renderDetails = () => {
    const { model, modelVersions } = this.props;
    const {
      stageFilter,
      showDescriptionEditor,
      isDeleteModalVisible,
      isDeleteModalConfirmLoading,
    } = this.state;
    const modelName = model.name;
    const editIcon = <a onClick={this.startEditingDescription}><Icon type='form' /></a>;
    return (
      <div className='model-view-content'>
        {/* Metadata List */}
        <Descriptions className='metadata-list'>
          <Descriptions.Item label='Created Time'>
            {Utils.formatTimestamp(model.creation_timestamp)}
          </Descriptions.Item>
          <Descriptions.Item label='Last Modified'>
            {Utils.formatTimestamp(model.last_updated_timestamp)}
          </Descriptions.Item>
        </Descriptions>

        {/* Page Sections */}
        <CollapsibleSection
          title={<span>Description {
            !showDescriptionEditor && PermissionUtils.permissionLevelCanEdit(model.permission_level)
              ? editIcon
              : null}</span>}
          forceOpen={showDescriptionEditor}
        >
          <EditableNote
            defaultMarkdown={model.description}
            onSubmit={this.handleSubmitEditDescription}
            onCancel={this.handleCancelEditDescription}
            showEditor={showDescriptionEditor}
          />
        </CollapsibleSection>
        <CollapsibleSection title={(
          <span>
            Versions{' '}
            <Radio.Group
              className='active-toggle'
              value={stageFilter}
              onChange={this.handleStageFilterChange}
            >
              <Radio.Button value={StageFilters.ALL}>All</Radio.Button>
              <Radio.Button value={StageFilters.ACTIVE}>
                Active({this.getActiveVersionsCount()})
              </Radio.Button>
            </Radio.Group>
          </span>
        )}>
          <ModelVersionTable
            activeStageOnly={stageFilter === StageFilters.ACTIVE}
            modelName={modelName}
            modelVersions={modelVersions}
          />
        </CollapsibleSection>

        {/* Delete Model Dialog */}
        <Modal
          title="Delete Model"
          visible={isDeleteModalVisible}
          confirmLoading={isDeleteModalConfirmLoading}
          onOk={this.handleDeleteConfirm}
          okText='Delete'
          okType='danger'
          onCancel={this.hideDeleteModal}
        >
          <span>Are you sure you want to delete {modelName}? </span>
          <span>This cannot be undone.</span>
        </Modal>
      </div>
    );
  };

  render() {
    const { model } = this.props;
    const modelName = model.name;
    const chevron = <i className='fas fa-chevron-right breadcrumb-chevron' />;
    const breadcrumbItemClass = 'truncate-text single-line breadcrumb-title';
    return (
      <div className='model-view-content'>
        <h1 className='breadcrumb-header'>
          <Link to={modelListPageRoute} className={breadcrumbItemClass}>Registered Models</Link>
          {chevron}
          <span className={breadcrumbItemClass}>{modelName}</span>
          {PermissionUtils.permissionLevelCanManage(model.permission_level)
            && this.renderBreadCrumbDropdown()}
        </h1>
        {Utils.isModelServingEnabled() ?
          <Tabs animated={false}>
            <TabPane tab="Details" key="1">
              {this.renderDetails()}
            </TabPane>
            <TabPane tab="Serving" key="2">
              <ServingPane modelName={model.name} />
            </TabPane>
          </Tabs>
          : this.renderDetails()}
      </div>
    );
  }
}
