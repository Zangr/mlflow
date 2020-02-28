import { Form, Input } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const { TextArea } = Input;
class TransitionRequestForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className='transition-request-form'>
        <Form.Item label='Comment'>
          {getFieldDecorator('comment')(
            <TextArea rows={4} placeholder='Comment'/>,
          )}
        </Form.Item>
      </Form>);
  }
}

export default Form.create()(TransitionRequestForm);
