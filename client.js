import React from "react";
import AdminList from "meteor/lef:adminlist";
import SystemMailsCollection from "./collection";
import { Switch, Route } from "react-router-dom";
import { Translate, Translator } from "meteor/lef:translations";
import { withTracker } from "meteor/react-meteor-data";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Button,
  Label,
  Input
} from "reactstrap";
import { NewAlert } from "meteor/lef:alerts";
import MarkdownIt from "markdown-it";
import PropTypes from "prop-types";

const Overview = ({ history, match }) => {
  return (
    <>
      <h1>
        <Translate _id="system_mails" />
      </h1>
      <AdminList
        collection={SystemMailsCollection}
        subscription="systemmails"
        fields={["_id"]}
        getTotalCall="totalSystemMails"
        edit={doc => history.push(`${match.url}/edit/${doc._id}`)}
      />
    </>
  );
};

translator = new Translator();

const InsertParams = ({ params, insertParam, where }) => {
  return (
    <>
      <h6>
        <Translate _id="insert" />:
      </h6>
      {Object.keys(params).map(param => {
        return (
          <span key={param}>
            <Button onClick={() => insertParam(param, where)}>
              <Translate _id={param} />
            </Button>{" "}
          </span>
        );
      })}
    </>
  );
};

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      language: translator.getDefault()
    };
    this.toggleLanguageSelect = this.toggleLanguageSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.insertParam = this.insertParam.bind(this);
    this.save = this.save.bind(this);
  }
  static getDerivedStateFromProps({ mail }) {
    return { mail } || null;
  }
  toggleLanguageSelect() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }
  changeLanguage(language) {
    this.setState({ language });
  }
  handleChange(e) {
    const { name, value } = e.target;
    const { mail, language } = this.state;
    mail[name][language] = value;
    this.setState({ mail });
  }
  insertParam(param, where) {
    const { mail, language } = this.state;
    mail[where][language] += ` {{${param}}}`;
    this.setState({ mail });
  }
  save() {
    console.log(this.state.mail);
    Meteor.call("updateSystemMail", this.state.mail, (e, r) => {
      if (r) NewAlert({ translate: "saved", type: "success" });
      if (e) NewAlert({ msg: e.error, type: "danger" });
    });
  }
  render() {
    if (this.props.loading) return "loading...";
    else {
      const translator = new Translator();
      const { language } = this.state;
      const { _id, params, subject, body } = this.state.mail;
      return (
        <>
          <h1>Edit {_id}</h1>
          <ButtonDropdown
            isOpen={this.state.dropdownOpen}
            toggle={this.toggleLanguageSelect}
          >
            <DropdownToggle caret>
              <Translate _id="edit_language" />: {language.toUpperCase()}
            </DropdownToggle>
            <DropdownMenu>
              {translator.getLanguages().map(language => {
                return (
                  <DropdownItem
                    onClick={() => this.changeLanguage(language)}
                    key={language}
                  >
                    {language.toUpperCase()}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </ButtonDropdown>
          <InsertParams
            params={params}
            insertParam={this.insertParam}
            where="subject"
          />
          <FormGroup>
            <Label>
              <Translate _id="subject" />
            </Label>
            <Input
              type="text"
              name="subject"
              value={subject[language] || ""}
              onChange={this.handleChange}
            />
          </FormGroup>
          <InsertParams
            params={params}
            insertParam={this.insertParam}
            where="body"
          />
          <FormGroup>
            <Label>
              <Translate _id="email_body" />
            </Label>
            <Input
              type="textarea"
              name="body"
              rows="10"
              value={body[language] || ""}
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button onClick={this.save} color="success">
            <Translate _id="save" />
          </Button>{" "}
          <Button onClick={this.props.history.goBack} color="warning">
            <Translate _id="cancel" />
          </Button>
          <h5>
            <Translate _id="preview" />
          </h5>
          <div
            dangerouslySetInnerHTML={{
              __html: MarkdownIt({
                html: true,
                linkify: true,
                typography: true
              }).render(body[language] || "")
            }}
          />
        </>
      );
    }
  }
}

const EditContainer = withTracker(({ match }) => {
  const { _id } = match.params;
  const handle = Meteor.subscribe("systemmails", { _id });
  return {
    loading: !handle.ready(),
    mail: SystemMailsCollection.findOne({ _id })
  };
})(Edit);

const SystemMailsAdmin = ({ match }) => {
  return (
    <Switch>
      <Route path={match.url} exact component={Overview} />
      <Route path={match.url + "/edit/:_id"} exact component={EditContainer} />
    </Switch>
  );
};

SystemMailsAdmin.propTypes = {
  match: PropTypes.object.isRequired
};

export default SystemMailsAdmin;
