import $ from 'jquery';
import Utils from '../utils/Utils';

export class Services {
  /**
   * Enable serving
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static enableServing({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/enable'), {
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * Disable serving
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static disableServing({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/disable'), {
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * Get endpoint status
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static getEndpointStatus({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/get-status'), {
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * List endpoint versions
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static listEndpointVersions({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/list-versions'), {
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * Get endpoint version logs
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static getEndpointVersionLogs({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/get-version-logs'), {
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * List endpoint version aliases
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static listEndpointVersionAliases({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/list-version-aliases'), {
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * Get event history
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static getEndpointEventHistory({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/get-event-history'), {
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }
  /**
   * Get endpoint metric history
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static getEndpointMetricHistory({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/endpoints/get-metric-history'), {
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * Submit model serving request
   * @param data
   * @param success
   * @param error
   * @returns {*|jQuery|*|*|*|*}
   */
  static submitServingRequest({ data, success, error }) {
    const url = "ajax-model/" + data.modelName + "/" + data.modelVersionName + "/invocations";
    return $.ajax(Utils.getAjaxUrl(url), {
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; format=pandas-records',
      data: data.servingRequestPayload,
      jsonp: false,
      success: success,
      error: error,
    });
  }
}
