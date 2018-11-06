import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    destroyBrew: function(model) {
      var _this = this;
      if(confirm("Are you sure you want to delete this brew?")) {
        model.destroyRecord().then(function() {
          _this.flash.render("Brew successfully destroyed");
          _this.transitionTo('index');
        });
      }
    }
  }
});
