import BSFormField from './bs-form-field';

export default BSFormField.extend({
  actions: {
    selectValue (value) {
      let optionsContent = this.optionsContent.toArray();
      let selection = optionsContent[value];
      let model = this.model;
      let property = this.property;
      model.set(property, selection);
    }
  }
});
