import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(this.state.data, this.schema, options);
    if (!result.error) return null;

    const errors = {};
    result.error.details.map(e => (errors[e.path[0]] = e.message));

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  createInput = (name, label, type = "text") => {
    return (
      <Input
        name={name}
        label={label}
        type={type}
        onChange={this.handleChange}
        value={this.state.data[name]}
        error={this.state.errors[name]}
      />
    );
  };

  createSelect = (name, label, options) => {
    const { errors, data } = this.state;
    return (
      <Select
        name={name}
        label={label}
        options={options}
        error={errors[name]}
        value={data[name]}
        onChange={this.handleChange}
      />
    );
  };

  createSubmit = label => {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  };
}

export default Form;
