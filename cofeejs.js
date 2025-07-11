const NAME_PROPERTY_STATUS = "status";
const NAME_PROPERTY_STATE = "state";
const NAME_PROPERTY_LEVELS = "levels";
const NAME_ACTION_BREW = "brew";
const NAME_ACTION_TURN_OFF = "turn_off";
const NAME_ACTION_RESET = "reset";

let thing = WoT.produce({
		name: "coffeemachineTD",
		description: "coffeemachine example Thing",
		"@context": ["http://www.w3.org/ns/td", {"htv": "http://www.w3.org/2011/http#"}],
	});

console.log("Produced " + thing.name);

thing.addProperty(
	NAME_PROPERTY_STATUS,
	{
		"type": "string",
		"enum": ["brewing", "grinding", "error"],
		"forms": [{
			"href": "/status",
			"htv:method": "GET"
		}],
		"readonly": true
	},
	0);

thing.addProperty(
	NAME_PROPERTY_STATE,
	{
		"description": "to check if the machine is on or off and turn off if necessary",
		"type": "object",
		"properties": {
			"current state": {
				"type": "string",
				"enum": ["on", "off"],
				"readonly": true
			},
			"newstate": {
				"type": "string",
				"enum": ["off"],
				"writeonly": true
			}
		},
		"forms": [{
			"href": "/state"
		}]
	},
	0);

thing.addProperty(
	NAME_PROPERTY_LEVELS,
	{
                "description": "it contains the level of water,beans and bin",
	        "type": "object",
		"properties": {
			"water_lvl": {
				"type": "number",
				"readonly": true
			},
			"bean_lvl": {
				"type": "number",
				"readonly": true
			},
			"bin_lvl": {
				"type": "number",
				"readonly": true
			}
		},
		"forms": [{
			"href": "/levels"
		}]
		
	},
	0);

thing.addAction(
	NAME_ACTION_BREW,
	{
        	"description": "choose what kind of coffee you want to order",
		"input": {
			"type": "string",
			"enum": ["mocha", "americano", "cappicino"]
		},
		"output": {
			"type": "string"
		},
		"forms": [{
			"href": "/brew"
		}]
	},
		
        (input) => {
		console.log("brewing...");
		return thing.properties[NAME_PROPERTY_STATUS].read().then( () => {
                        if(input === "mocha" || input === "cappicino" || input === "americano" ){
				thing.actions[NAME_ACTION_BREW].output = "brewing ${input}";
				console.log(thing.actions[NAME_ACTION_BREW].output);
			}
			else {
				console.log("no such coffee exists");
				return;
			}
   			
			thing.properties[NAME_PROPERTY_STATUS].write("brewing");
		});
                SetTimeOut(2000);
	});

thing.addAction(
	NAME_ACTION_TURN_OFF,
	{
		"forms": [{
				"href": "/turn_off"
			}]
	},
	() => {
		console.log("Turnýng off");
		return thing.properties[NAME_PROPERTY_STATE].read().then( () => {
			let value = "off";
			thing.properties[NAME_PROPERTY_STATE].write(value);
		});
	});

thing.addAction(
	NAME_ACTION_RESET,
	{},
	() => {
		console.log("Resetting");
		thing.properties[NAME_PROPERTY_COUNT].write(0);
	});

// test setting metadata
thing["support"] = "git://github.com/eclipse/thingweb.node-wot.git";

thing.expose().then( () => { console.info(thing.name + " ready"); } );









---------------------------------------------------------------------------




{
	"@context": [
          "http://www.w3.org/ns/td",
          {"htv": "http://www.w3.org/2011/http#"}
        ],
	"id": "urn:dev:wot:com:example:servient:coffeemachine",
	"name": "coffeemachineTD",
	"securityDefinitions": {
		"basic_sc": {
			"scheme": "basic",
			"in": "header"
		}
	},
	"base": "https://coffee.example.com",
	"security": ["basic_sc"],
	"properties": {
		"status": {
			"type": "string",
			"enum": ["brewing", "grinding", "error"],
			"forms": [{
				"href": "/status",
				"htv:method": "GET"
			}],
			"readonly": true
		},
		"state": {
			"description": "to check if the machine is on or off and turn off if necessary",
			"type": "object",
			"properties": {
				"current state": {
					"type": "string",
					"enum": ["on", "off"],
					"readonly": true
				},
				"newstate": {
					"type": "string",
					"enum": ["off"],
					"writeonly": true
				}
			},
			"forms": [{
				"href": "/state"
			}]
		},
		"levels": {
			"description": "it contains the level of water,beans and bin",
			"type": "object",
			"properties": {
				"water_lvl": {
					"type": "number",
					"readonly": true
				},
				"bean_lvl": {
					"type": "number",
					"readonly": true
				},
				"bin_lvl": {
					"type": "number",
					"readonly": true
				}
			},
			"forms": [{
				"href": "/levels"
			}]
		}
	},
	"actions": {
		"brew": {
			"description": "choose what kind of coffee you want to order",
			"input": {
				"type": "string",
				"enum": ["mocha", "americano", "cappicino"]
			},
			"output": {
				"type": "string"
			},
			"forms": [{
				"href": "/brew"
			}]
		},
		"turn_off": {
			"forms": [{
				"href": "/turn_off"
			}]
		}
	},
	"events": {
		"notEnoughWater": {
			"data": {
				"type": "integer"
			},
			"forms": [{
				"href": "/notEnoughWater"
			}]
		},
		"notEnoughBeans": {
			"data": {
				"type": "integer"
			},
			"forms": [{
				"href": "/notEnoughBeans"
			}]
		},
		"binIsFull": {
			"data": {
				"type": "integer"
			},
			"forms": [{
				"href": "/binIsFull"
			}]
		}
	}
}












