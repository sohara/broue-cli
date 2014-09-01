export default function () {

  var stubs = {};
  stubs.user = {
    id: 1,
    bio: "I like to brew. More than you.",
    username: "sohara",
    email: "sohara@sohara.com"
  };

  stubs.userJSON = {
    token: "aQXpLwsQivHhYZKZyaF2",
    email: "sohara@sohara.com",
    user_id: 1,
    user: stubs.user
  };

  stubs.brews = [
    {
      id: 1,
        name: "Awesome IPA",
        created_at: "2012-09-12T11:59:04Z",
        batch_size_litres: 120,
        batch_size_gallons: 31.70064,
        boil_loss_litres: 10,
        boil_loss_gallons: 2.64172,
        efficiency: 82,
        grain_temp: 20,
        target_mash_temp: 69,
        water_grain_ratio_metric: 3,
        water_grain_ratio_us: 1.43792,
        style_id: 1,
        user_id: 1,
        fermentable_addition_ids: [139],
        hop_addition_ids: [202],
        yeast_addition_ids: [14],
        note_ids: [57]
    },
    {
      id: 2,
      name: "Summer Saison",
      created_at: "2014-06-23T21:56:31Z",
      batch_size: 120,
      boil_loss: 10,
      efficiency: 82,
      grain_temp: 20,
      target_mash_temp: 69,
      water_grain_ratio: 3,
      style_id: 18
    }
  ];

  stubs.fermentable_additions = [
    {
      brew_id: 1,
        fermentable_id: 45,
        id: 139,
        weight_grams: 23000,
        weight_oz: 811.30
    }
  ];

  stubs.fermentables = [
    {
      coarse_fine_difference: 1,
        color: 2.7,
        fermentable_type: "Grain",
        id: 45,
        moisture: 4.1,
        name: "Superior Pale Ale",
        supplier: "Canada Malting",
        total_yield: 80
    }
  ];

  stubs.hop_additions = [
    {
      alpha_acids: 15.1,
        boil_time: 62,
        brew_id: 1,
        form: "Pellet",
        hop_id: 45,
        id: 202,
        use: "First Wort",
        weight_grams: 100,
        weight_oz: 3.52739
    }
  ];
  stubs.hops = [
    {
      alpha_acids: 16,
        id: 45,
        name: "Warrior"
    }
  ];

  stubs.yeast_additions = [
    {id:14, amount:50, yeast_id:40, brew_id:1, unit:null}
  ];

  stubs.yeasts = [
    {
      attenuation_high: 85,
        attenuation_low: 78,
        flocculation: "Medium",
        form: "Liquid",
        id: 40,
        name: "Belgian Saison II Yeast",
        notes: "Saison strain with more fruity ester production than with WLP565. Moderately phenolic, with a clove-like characteristic in finished beer flavor and aroma. Ferments faster than WLP565.",
        product_id: "WLP566",
        supplier: "White Labs",
        temperature_high: 26,
        temperature_low: 20
    }
  ];

  stubs.notes = [
    {
      brew_id: 1,
        created_at: "2012-09-12T14:08:45Z",
        id: 57,
        text: "Brew day 1: used 532g caramel 60 and... ",
    }
  ];

  stubs.styles = [
    {
      id: '1',
        subcategory_id: "1A",
        subcategory_name: "Lite American Lager"
    },
    {
      id: '18',
      subcategory_id: "6A",
      subcategory_name: "Cream Ale"
    }
  ];

  return stubs;
}
