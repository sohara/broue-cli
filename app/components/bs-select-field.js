import BSFormField from './bs-form-field';

export default BSFormField.extend({
  actions: {
    selectValue (value) {
      let optionsContent = this.get('optionsContent').toArray();
      let selection = optionsContent[value];
      let model = this.get('model');
      let property = this.get('property');
      model.set(property, selection);
    }
  }
});
