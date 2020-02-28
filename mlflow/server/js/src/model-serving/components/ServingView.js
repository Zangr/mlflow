import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button, Popover, Icon } from 'antd';
import { StageTagComponents } from '../../model-registry/constants';
import classNames from 'classnames';

// Wrapper around the logs textarea, to allow auto-scroll to the bottom on update.
class LogsContainer extends React.Component {
  static propTypes = {
    versionLogs: PropTypes.string.isRequired,
  };

  logsTextarea = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.versionLogs !== prevProps.versionLogs) {
      this.logsTextarea.current.scrollTop = this.logsTextarea.current.scrollHeight;
    }
  }

  render() {
    const { versionLogs } = this.props;
    return (
      <div className="serving-logs-container">
        <div><h3>Logs</h3></div>
        <div>
          <textarea
            ref={this.logsTextarea}
            className="serving-logs-textarea"
            readOnly
            value={versionLogs || "Loading..."}/>
        </div>
      </div>
    );
  }
}

export class ServingView extends React.Component {
  static propTypes = {
    modelName: PropTypes.string.isRequired,

    endpoint: PropTypes.shape({
      status: PropTypes.string.isRequired,
      message: PropTypes.string,
    }),

    endpointVersions: PropTypes.arrayOf(PropTypes.shape({
      endpoint_version_name: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      state_message: PropTypes.string,
    })),

    aliases: PropTypes.arrayOf(PropTypes.shape({
      alias: PropTypes.string.isRequired,
      endpoint_version_name: PropTypes.string.isRequired,
    })),

    handleEnableServing: PropTypes.func.isRequired,
    handleDisableServing: PropTypes.func.isRequired,
    handleSelectEndpointVersion: PropTypes.func.isRequired,
    handleServingRequest: PropTypes.func.isRequired,
  };

  iconReady = <i className='fa fa-circle ok'/>;
  iconPending = <i className='fa fa-circle pending'/>;
  iconFailed = <i className='fa fa-circle error'/>;

  getAliasesForVersion = (endpointVersionName) => {
    const { aliases } = this.props;
    if (!aliases) {
      return [];
    }
    const matchingAliases = aliases.filter((v) => {
      return v.endpoint_version_name === endpointVersionName;
    });
    return matchingAliases.map((v) => v.alias);
  };

  state = {
    requestBody: "",
    enableServingInProgress: false,
    servingRequestInProgress: false,
    selectedVersion: null,
    versionLogs: null,
  };

  requestTooltipContent = (
    <div className="serving-tooltip-content">
      <p>Requests should be a JSON-formatted Pandas DataFrame with the `records` orient
      <br />produced using the `pandas.DataFrame.to_json(..., orient='records')` method.</p>
      <p>Examples:</p>
      <pre>{'[{"A":1,"B":4,"C":7},{"A":2,"B":5,"C":8},{"A":3,"B":6,"C":9}]'}</pre>
      <pre>{'[[1,2,3], [4,5,6]]'}</pre>
      <a
        href="https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#orient-options"
        target="_blank"
        rel="noopener noreferrer"
      >
        More info
      </a>
    </div>
  );

  responseTooltipContent = (
    <div className="serving-tooltip-content">
      Response structure depends on the model type, and will be encoded in the same
      <br />fashion as the input. Commonly, this will be a Pandas dataframe or numpy array.
    </div>
  );

  modelUrlsTooltipContent = (
    <div className="serving-tooltip-content">
      <p>Use these endpoints to query your model using API token authentication.
        <br />See the&nbsp;
        <a
          href="https://mlflow.org/docs/latest/models.html#local-model-deployment"
          target="_blank"
          rel="noopener noreferrer"
        >
          MLflow documentation
        </a>
        &nbsp;for example request structure.
      </p>
      <p>
        Every version can be called using its model version number. Additionally,
        <br />the latest version of each stage (e.g., "Production") can be callable using
        <br />this alias, which can be used as a stable identifier by clients.
      </p>
    </div>
  );

  getClusterTooltip = () => {
    const { endpoint } = this.props;
    const stateMessage = endpoint.state_message ? endpoint.state_message : "None";
    const message = <div>Message: {stateMessage}</div>;
    return <div>
      Cluster associated with serving endpoint.
      {message}
    </div>;
  };

  componentDidMount = () => {
    this.selectDefaultVersion();
  };

  componentDidUpdate = () => {
    this.selectDefaultVersion();
  };

  selectDefaultVersion = () => {
    if (!this.state.selectedVersion
        && this.props.endpointVersions
        && this.props.endpointVersions.length > 0) {
      this.selectVersion(this.props.endpointVersions[0]);
    }
  };

  enableDisablementComplete = () => {
    this.setState({enableServingInProgress: false});
  };

  enableServing = () => {
    this.setState({enableServingInProgress: true});
    this.props.handleEnableServing(this.enableDisablementComplete);
  };

  disableServing = () => {
    this.setState({
      enableServingInProgress: true,
      servingRequestInProgress: false,
      selectedVersion: null,
      versionLogs: null,
    });

    this.props.handleDisableServing(this.enableDisablementComplete);
  };

  onRequestBodyChange = (event) => {
    this.setState({requestBody: event.target.value});
  };

  onServingResponse = (response) => {
    this.setState({
      responseBody: response.value,
      responseFailure: false,
      servingRequestInProgress: false,
    });
  };

  onServingResponseError = (e) => {
    this.setState({
      responseBody: e.getMessageField(),
      responseFailure: true,
      servingRequestInProgress: false,
    });
  };

  submitServingRequest = () => {
    const { selectedVersion, requestBody } = this.state;
    this.setState({
      servingRequestInProgress: true,
      responseFailure: false,
      responseBody: "",
    });
    this.props.handleServingRequest(
      selectedVersion.endpoint_version_name,
      requestBody,
      this.onServingResponse,
      this.onServingResponseError,
      );
  };

  renderEnableServing = () => {
    return (<div>
      <div>
        Enable realtime model serving behind a REST API interface.
        This will launch a single-node cluster.
      </div>
      <Button
          className='enable-serving-button'
          type='primary'
          htmlType='button'
          onClick={this.enableServing}
          disabled={this.state.enableServingInProgress}
          size='large'
        >
        Enable Serving
        </Button>
    </div>);
  };

  selectVersion = (version) => {
    this.setState({selectedVersion: version, versionLogs: null});

    const myThis = this;
    const logsCallback = (response) => {
      if (myThis.state.selectedVersion === version) {
        myThis.setState({versionLogs: response.value.logs});
      }
    };
    this.props.handleSelectEndpointVersion(version.endpoint_version_name, logsCallback);
  };

  isSelected = (version) => {
    return this.state.selectedVersion
      && this.state.selectedVersion.endpoint_version_name === version.endpoint_version_name;
  };

  renderVersionOnSidebar = (version) => {
    const { endpoint_version_name } = version;

    let statusIcon = null;
    if (version.state === "VERSION_STATE_READY") {
      statusIcon = <span>{this.iconReady} Ready</span>;
    } else if (version.state === "VERSION_STATE_PENDING") {
      statusIcon = <span>{this.iconPending} Pending</span>;
    } else if (version.state === "VERSION_STATE_LAUNCHING") {
      statusIcon = <span>{this.iconPending} Launching</span>;
    } else if (version.state === "VERSION_STATE_FAILED") {
      statusIcon = <span>{this.iconFailed} Failed</span>;
    }
    const aliases = this.getAliasesForVersion(endpoint_version_name);
    const tagComponents = aliases.map((alias) => StageTagComponents[alias]);
    const containerClassNames = classNames({
      "serving-version-container": true,
      "selected": this.isSelected(version),
    });
    return (
      <div
          key={endpoint_version_name}
          onClick={() => this.selectVersion(version)}
          className={containerClassNames}
      >
        <div className="serving-version-status-container">
          <div className="serving-version-version-num">
            Version {endpoint_version_name}
          </div>
          <div className='serving-version-status-indicator'>
            {statusIcon}
          </div>
        </div>
        <div className="serving-version-stage-container">
          {tagComponents}
        </div>
      </div>
    );
  };

  renderVersionsSidebar = () => {
    const { endpointVersions } = this.props;
    if (!endpointVersions) {
      return [];
    }
    return endpointVersions.map(version => this.renderVersionOnSidebar(version));
  };

  renderTooltip = (contents) => {
    return (
      <Popover
        overlayClassName="serving-tooltip"
        content={contents}
        placement="bottom"
      >
        <Icon
          type="question-circle"
          className="serving-question-mark"
          theme="filled"
        />
      </Popover>
    );
  }

  renderEndpointStaus = () => {
    const { endpoint } = this.props;
    const disableServingButton = (<span>
      - <span onClick={this.disableServing} className="serving-stop-link">Stop</span>
    </span>);
    if (endpoint.state === "ENDPOINT_STATE_READY") {
      return <span>{this.iconReady} Ready {disableServingButton}</span>;
    } else if (endpoint.state === "ENDPOINT_STATE_PENDING") {
      return <span>{this.iconPending} Pending {disableServingButton}</span>;
    } else if (endpoint.state === "ENDPOINT_STATE_FAILED") {
      return <span>{this.iconFailed} Failed</span>;
    }
    return null;
  };

  renderModelUrlContainer = () => {
    const { modelName } = this.props;
    const { selectedVersion } = this.state;
    const { endpoint_version_name } = selectedVersion;
    const urlPrefix = "https://" + window.location.host + "/model/mlflow-model-";
    const modelUrls = [urlPrefix + modelName + "/" + endpoint_version_name];
    const aliases = this.getAliasesForVersion(endpoint_version_name);
    aliases.forEach(alias => {
      modelUrls.push(urlPrefix + modelName + "/" + alias);
    });

    const modelDivs = modelUrls.map(url => <div>{url}</div>);

    return (
      <div className="serving-model-url-container">
        <div className="serving-model-url-title">
          Model URL:
          {this.renderTooltip(this.modelUrlsTooltipContent)}
        </div>
        <div className="serving-model-urls">
          {modelDivs}
        </div>
      </div>
    );
  };

  renderCallModelContainer = () => {
    const { requestBody, responseBody, responseFailure, servingRequestInProgress } = this.state;

    const responseTextareaClassnames = classNames({
      "serving-response-textarea": true,
      "failed": responseFailure,
    });

    return (
      <div className="serving-call-model-container">
        <div><h3>Call the model</h3></div>
        <div className="serving-request-response-container">
          <div className="serving-request-container">
            <b>Request</b>
            {this.renderTooltip(this.requestTooltipContent)}
            <div>
              <textarea
                defaultValue={requestBody}
                onChange={this.onRequestBodyChange}
                className="serving-request-textarea"/>
            </div>
          </div>
          <div className="serving-response-container">
            <b>Response</b>
            {this.renderTooltip(this.responseTooltipContent)}
            <div>
              <textarea
                readOnly
                value={responseBody}
                className={responseTextareaClassnames}/>
             </div>
          </div>
        </div>
        <div>
          <Button
            className='submit-request-button'
            type='primary'
            htmlType='button'
            onClick={this.submitServingRequest}
            disabled={servingRequestInProgress}
            size='small'
          >
            Send Request
          </Button>
        </div>
      </div>
    );
  };

  renderVersionDetails = () => {
    const { selectedVersion, versionLogs } = this.state;
    if (!selectedVersion) {
      return null;
    }

    return (
      <div>
        {this.renderModelUrlContainer()}
        {this.renderCallModelContainer()}
        <LogsContainer versionLogs={versionLogs} />
      </div>
    );
  };

  renderServingDetails = () => {
    const { modelName } = this.props;

    return (<div>
      <Row className='metadata-container'>
        <Col className='metadata-entry' span={8}>
          <span className='metadata-header'>Status: </span>
          <span className='metadata-info'>
            {this.renderEndpointStaus()}
          </span>
        </Col>
        <Col className='metadata-entry' span={8}>
          <span className='metadata-header'>Cluster: </span>
          <span className='metadata-info'>
            <a
              href="/#setting/clusters"
              target="_blank"
              rel="noopener noreferrer"
            >
              mlflow-model-{modelName}
            </a>
            {this.renderTooltip(this.getClusterTooltip())}
          </span>
        </Col>
      </Row>
      <div><h2>Model Versions</h2></div>
      <div className="serving-main-panel">
        <div className="serving-versions-panel">
          {this.renderVersionsSidebar()}
        </div>
        <div className="serving-version-details-panel">
          {this.renderVersionDetails()}
        </div>
      </div>
    </div>);
  };

  render = () => {
    if (this.props.endpoint) {
      return this.renderServingDetails();
    }
    return this.renderEnableServing();
  };
}
