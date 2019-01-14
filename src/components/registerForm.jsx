import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import * as userService from "./../services/userService";
import auth from "./../services/authService";

class RegisterForm extends Form {
  state = { data: { email: "", password: "", name: "" }, errors: {} };
  schema = {
    email: Joi.string()
      .email()
      .required()
      .label("Username"),
    password: Joi.string()
      .min(5)
      .required()
      .label("Password"),
    name: Joi.string()
      .required()
      .min(2)
      .label("Name")
  };

  async doSubmit() {
    try {
      const { headers } = await userService.register(this.state.data);
      auth.loginWithJwt(headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.createInput("email", "Username / Email", "email")}
          {this.createInput("password", "Password", "password")}
          {this.createInput("name", "Name")}
          {this.createSubmit("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
