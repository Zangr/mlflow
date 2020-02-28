import React from 'react';
import { Table, Divider, Modal } from 'antd';
import PropType from 'prop-types';
import { ActivityTypes, StageTagComponents, TransitionRequestActions } from '../constants';
import TransitionRequestForm from './TransitionRequestForm';
import PermissionUtils from '../../utils/PermissionUtils';

const Column = Table.Column;
const COLUMN_REQUEST = 'Request';
const COLUMN_REQUEST_BY = 'Request by';
const COLUMN_ACTIONS = 'Actions';

export class PendingRequestsTable extends React.Component {
  static propTypes = {
    pendingRequests: PropType.arrayOf(Object),
    onPendingRequestApproval: PropType.func.isRequired,
    onPendingRequestRejection: PropType.func.isRequired,
    onPendingRequestDeletion: PropType.func.isRequired,
  };

  state = {
    confirmModalVisible: false,
    confirmingRequestAction: TransitionRequestActions.APPROVE,
    confirmingRequest: null,
  };

  transitionFormRef = React.createRef();

  renderActionsColumn = (pendingRequest) => {
    const approveLink = (
      <a onClick={() => this.showConfirmModal(pendingRequest, TransitionRequestActions.APPROVE)}>
        Approve
      </a>
    );

    const rejectLink = (
      <a onClick={() => this.showConfirmModal(pendingRequest, TransitionRequestActions.REJECT)}>
        Reject
      </a>
    );

    const cancelLink = (
      <a onClick={() => this.showConfirmModal(pendingRequest, TransitionRequestActions.CANCEL)}>
        Cancel
      </a>
    );

    return (
      <span>
        {PermissionUtils.permissionLevelCanManage(pendingRequest.permission_level) && (
          <React.Fragment>
            {approveLink}
            <Divider type="vertical" />
            {rejectLink}
            <Divider type="vertical" />
          </React.Fragment>
        )}
        {PermissionUtils.permissionLevelIsOwner(pendingRequest.permission_level) && cancelLink}
      </span>
    );
  };

  renderPendingRequestDescription = (request, action) => {
    const isRequestTransition = request.type === ActivityTypes.REQUESTED_TRANSITION;
    const isRequestDeletion = action === TransitionRequestActions.CANCEL;
    return (
      <div>
        {isRequestTransition
          ? 'Request transition to'
          : (isRequestDeletion ? 'Cancel request to transition to' : 'Transition to')}
        &nbsp;&nbsp;&nbsp;<i className='fas fa-long-arrow-alt-right'/>&nbsp;&nbsp;&nbsp;&nbsp;
        {StageTagComponents[request.to_stage]}
      </div>
    );
  };

  showConfirmModal = (confirmingRequest, confirmingRequestAction) => {
    this.setState({
      confirmModalVisible: true,
      confirmingRequest,
      confirmingRequestAction,
    });
  };

  closeConfirmModal = () => {
    this.setState({ confirmModalVisible: false });
  };

  handleConfirmModalConfirm = () => {
    const { confirmingRequest, confirmingRequestAction } = this.state;
    const comment = this.transitionFormRef.current.getFieldValue('comment');
    this.transitionFormRef.current.resetFields();
    if (confirmingRequestAction === TransitionRequestActions.APPROVE) {
      this.props.onPendingRequestApproval(confirmingRequest, comment);
    } else if (confirmingRequestAction === TransitionRequestActions.REJECT) {
      this.props.onPendingRequestRejection(confirmingRequest, comment);
    } else {
      this.props.onPendingRequestDeletion(confirmingRequest, comment);
    }
    this.closeConfirmModal();
  };

  render() {
    const { pendingRequests } = this.props;
    return (
      <div>
        <Table
          size='middle'
          rowKey='timestamp'
          className='pending-requests-table'
          dataSource={pendingRequests}
          pagination={false}
          locale={{ emptyText: 'No pending request.' }}
          style={{ maxWidth: 800 }}
        >
          <Column key={1} title={COLUMN_REQUEST} render={this.renderPendingRequestDescription} />
          <Column key={2} title={COLUMN_REQUEST_BY} dataIndex='user_id' />
          <Column key={3} title={COLUMN_ACTIONS} render={this.renderActionsColumn} />
        </Table>
        {this.renderConfirmModal()}
      </div>
    );
  }

  renderConfirmModal() {
    const { confirmModalVisible, confirmingRequestAction, confirmingRequest } = this.state;
    const isApproval = confirmingRequestAction === TransitionRequestActions.APPROVE;
    const isRejection = confirmingRequestAction === TransitionRequestActions.REJECT;
    return (
      <Modal
        title={`${isApproval ? 'Approve' : (isRejection ? 'Reject' : 'Cancel')} Pending Request`}
        visible={confirmModalVisible}
        onOk={this.handleConfirmModalConfirm}
        okText={`Confirm`}
        onCancel={this.closeConfirmModal}
      >
        {confirmingRequest &&
          this.renderPendingRequestDescription(confirmingRequest, confirmingRequestAction)}
        <TransitionRequestForm ref={this.transitionFormRef}/>
      </Modal>
    );
  }
}
