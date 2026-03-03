import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

actor {
  type HealthStatus = {
    #safe;
    #moderate;
    #harmful;
  };

  type Level = {
    #Low;
    #Medium;
    #High;
  };

  module FoodAnalysisResult {
    public type FoodAnalysisResult = {
      foodName : Text;
      calories : Nat;
      sugarLevel : Level;
      fatLevel : Level;
      healthScore : Nat;
      status : HealthStatus;
    };

    public func compare(result1 : FoodAnalysisResult, result2 : FoodAnalysisResult) : Order.Order {
      Text.compare(result1.foodName, result2.foodName);
    };
  };

  public type HealthCondition = {
    #diabetes;
    #highBloodPressure;
    #highCholesterol;
    #heartDisease;
    #obesity;
    #none;
  };

  public type UserProfile = {
    age : Nat;
    weight : Nat;
    healthConditions : [HealthCondition];
  };

  public type ProcessedIngredient = {
    name : Text;
    isHarmful : Bool;
  };

  public type IngredientScanResult = {
    processedIngredients : [ProcessedIngredient];
    harmfulCount : Nat;
  };

  var predefinedFoods : [(Text, FoodAnalysisResult.FoodAnalysisResult)] = [
    (
      "Apple",
      {
        foodName = "Apple";
        calories = 95;
        sugarLevel = #Medium;
        fatLevel = #Low;
        healthScore = 85;
        status = #safe;
      },
    ),
    (
      "Banana",
      {
        foodName = "Banana";
        calories = 105;
        sugarLevel = #Medium;
        fatLevel = #Low;
        healthScore = 80;
        status = #safe;
      },
    ),
    (
      "Chicken Breast",
      {
        foodName = "Chicken Breast";
        calories = 165;
        sugarLevel = #Low;
        fatLevel = #Low;
        healthScore = 90;
        status = #safe;
      },
    ),
    (
      "French Fries",
      {
        foodName = "French Fries";
        calories = 365;
        sugarLevel = #Low;
        fatLevel = #High;
        healthScore = 40;
        status = #harmful;
      },
    ),
    (
      "Soda",
      {
        foodName = "Soda";
        calories = 150;
        sugarLevel = #High;
        fatLevel = #Low;
        healthScore = 25;
        status = #harmful;
      },
    ),
    (
      "Salmon",
      {
        foodName = "Salmon";
        calories = 206;
        sugarLevel = #Low;
        fatLevel = #Medium;
        healthScore = 87;
        status = #safe;
      },
    ),
    (
      "Pizza",
      {
        foodName = "Pizza";
        calories = 266;
        sugarLevel = #Medium;
        fatLevel = #High;
        healthScore = 50;
        status = #moderate;
      },
    ),
    (
      "Broccoli",
      {
        foodName = "Broccoli";
        calories = 55;
        sugarLevel = #Low;
        fatLevel = #Low;
        healthScore = 92;
        status = #safe;
      },
    ),
    (
      "Ice Cream",
      {
        foodName = "Ice Cream";
        calories = 207;
        sugarLevel = #High;
        fatLevel = #High;
        healthScore = 30;
        status = #harmful;
      },
    ),
    (
      "Oatmeal",
      {
        foodName = "Oatmeal";
        calories = 158;
        sugarLevel = #Low;
        fatLevel = #Low;
        healthScore = 88;
        status = #safe;
      },
    ),
    (
      "Steak",
      {
        foodName = "Steak";
        calories = 271;
        sugarLevel = #Low;
        fatLevel = #High;
        healthScore = 75;
        status = #moderate;
      },
    ),
    (
      "Chocolate Bar",
      {
        foodName = "Chocolate Bar";
        calories = 235;
        sugarLevel = #High;
        fatLevel = #High;
        healthScore = 35;
        status = #harmful;
      },
    ),
    (
      "Carrots",
      {
        foodName = "Carrots";
        calories = 41;
        sugarLevel = #Low;
        fatLevel = #Low;
        healthScore = 95;
        status = #safe;
      },
    ),
    (
      "Potato Chips",
      {
        foodName = "Potato Chips";
        calories = 152;
        sugarLevel = #Low;
        fatLevel = #High;
        healthScore = 30;
        status = #harmful;
      },
    ),
    (
      "Pasta",
      {
        foodName = "Pasta";
        calories = 200;
        sugarLevel = #Medium;
        fatLevel = #Low;
        healthScore = 70;
        status = #moderate;
      },
    ),
    (
      "Yogurt",
      {
        foodName = "Yogurt";
        calories = 59;
        sugarLevel = #Medium;
        fatLevel = #Low;
        healthScore = 82;
        status = #safe;
      },
    ),
    (
      "Burger",
      {
        foodName = "Burger";
        calories = 295;
        sugarLevel = #Low;
        fatLevel = #High;
        healthScore = 45;
        status = #harmful;
      },
    ),
    (
      "Rice",
      {
        foodName = "Rice";
        calories = 130;
        sugarLevel = #Low;
        fatLevel = #Low;
        healthScore = 80;
        status = #safe;
      },
    ),
    (
      "Orange Juice",
      {
        foodName = "Orange Juice";
        calories = 112;
        sugarLevel = #High;
        fatLevel = #Low;
        healthScore = 60;
        status = #moderate;
      },
    ),
    (
      "Avocado",
      {
        foodName = "Avocado";
        calories = 160;
        sugarLevel = #Low;
        fatLevel = #Medium;
        healthScore = 92;
        status = #safe;
      },
    ),
  ];

  let foodMap = Map.fromIter<Text, FoodAnalysisResult.FoodAnalysisResult>(predefinedFoods.values());

  var userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func saveUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func getUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func analyzeFood(foodName : Text) : async ?FoodAnalysisResult.FoodAnalysisResult {
    foodMap.get(foodName);
  };

  public query ({ caller }) func scanIngredients(ingredients : [Text]) : async IngredientScanResult {
    let harmfulPatterns = List.fromArray([
      "high sugar",
      "MSG", // monosodium glutamate
      "artificial colors",
      "Red 40",
      "Yellow 5",
      "sodium benzoate",
      "BHA",
      "BHT",
    ]);

    func containsHarmfulPattern(ingredient : Text) : Bool {
      harmfulPatterns.any(
        func(pattern) {
          ingredient.contains(#text(pattern));
        }
      );
    };

    let processedIngredients = ingredients.map(
      func(ingredient) {
        {
          name = ingredient;
          isHarmful = containsHarmfulPattern(ingredient);
        };
      }
    );

    let harmfulCount = processedIngredients.filter(
      func(ingredient) {
        ingredient.isHarmful;
      }
    ).size();

    {
      processedIngredients;
      harmfulCount;
    };
  };

  public query ({ caller }) func getHealthWarnings(foodName : Text) : async {
    warnings : [Text];
    status : Text;
  } {
    let userProfile = userProfiles.get(caller);
    let food = foodMap.get(foodName);

    var warningsList = List.empty<Text>();
    var status = "Safe";

    func processWarning(condition : HealthCondition, warningMsg : Text) {
      warningsList.add(warningMsg);
    };

    if (userProfile != null and food != null) {
      let conditions = switch (userProfile) { case (?profile) { profile.healthConditions }; case (null) { [] } };
      let foodStatus = switch (food) { case (?f) { f.status }; case (null) { #safe } };

      switch (foodStatus) {
        case (#harmful) { status := "Harmful" };
        case (#moderate) { status := "Moderate" };
        case (#safe) { status := "Safe" };
      };

      for (condition in conditions.values()) {
        switch (condition) {
          case (#diabetes) {
            switch (food) {
              case (?f) {
                if (f.sugarLevel == #High) {
                  processWarning(#diabetes, "Not recommended for diabetic users");
                };
              };
              case (null) {};
            };
          };
          case (#heartDisease) {
            switch (food) {
              case (?f) {
                if (f.fatLevel == #High) {
                  processWarning(#heartDisease, "High fat content — caution for heart disease");
                };
              };
              case (null) {};
            };
          };
          case (#highBloodPressure) {
            switch (food) {
              case (?f) {
                if (f.sugarLevel == #High) {
                  processWarning(#highBloodPressure, "High sugar content may affect blood pressure");
                };
              };
              case (null) {};
            };
          };
          case (#highCholesterol) {
            switch (food) {
              case (?f) {
                if (f.fatLevel == #High) {
                  processWarning(#highCholesterol, "High fat content may worsen cholesterol levels");
                };
              };
              case (null) {};
            };
          };
          case (#obesity) {
            switch (food) {
              case (?f) {
                if (f.calories > 200) {
                  processWarning(#obesity, "High-calorie foods may contribute to obesity");
                };
              };
              case (null) {};
            };
          };
          case (#none) {};
        };
      };
    };

    func compareWarnings(warning1 : Text, warning2 : Text) : Order.Order {
      Text.compare(warning1, warning2);
    };

    let warnings = warningsList.toArray().sort(compareWarnings);

    switch (warnings.size()) {
      case (0) {
        { warnings = [status]; status };
      };
      case (_) {
        { warnings; status };
      };
    };
  };

  public query ({ caller }) func getAllFoods() : async [FoodAnalysisResult.FoodAnalysisResult] {
    foodMap.values().toArray().sort();
  };

  public query ({ caller }) func getUserHealthConditions() : async [HealthCondition] {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.healthConditions };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getFoodStats(foodName : Text) : async ?{
    calories : Nat;
    sugarLevel : Level;
    fatLevel : Level;
    healthScore : Nat;
  } {
    switch (foodMap.get(foodName)) {
      case (?food) {
        ?{
          calories = food.calories;
          sugarLevel = food.sugarLevel;
          fatLevel = food.fatLevel;
          healthScore = food.healthScore;
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserHealthStats() : async ?{ age : Nat; weight : Nat } {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        ?{
          age = profile.age;
          weight = profile.weight;
        };
      };
      case (null) { null };
    };
  };
};
