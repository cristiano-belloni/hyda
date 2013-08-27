define([], function() {
  
  var pluginConf = {
      name: "HyDA",
      osc: false,
      audioOut: 2,
      audioIn: 1,
      version: '0.0.1-alpha1',
      hostParameters : {
            enabled: true,
            parameters: {
                gain1: {
                    name: ['Gain 1'],
                    label: 'x',
                    range: {
                        min: 0,
                        default: 0.5,
                        max: 2
                    }
                },
                gain2: {
                    name: ['Gain 1'],
                    label: 'x',
                    range: {
                        min: 0,
                        default: 0.5,
                        max: 2
                    }
                }
            }
        }
  };

    var initPlugin = function(args) {
        
      this.name = args.name;
      this.id = args.id;
      this.audioSource = args.audioSources[0];
      this.audioDestinations = args.audioDestinations;
      this.context = args.audioContext;
  		this.gainDuplicatorNodes = [];

      for (var i = 0; i < this.audioDestinations.length; i+=1) {
        this.gainDuplicatorNodes[i] = this.context.createGainNode();
        this.audioSource.connect(this.gainDuplicatorNodes[i]);
        this.gainDuplicatorNodes[i].connect(this.audioDestinations[i]);
      }

      /* Parameter callbacks */
      var onParmChange = function (id, value) {
        this.pluginState[id] = value;
        if (id === 'gain1') {
          this.gainDuplicatorNodes[0].gain.value = value;
        }
        else if (id === 'gain2') {
          this.gainDuplicatorNodes[1].gain.value = value; 
        }
      }

      if (args.initialState && args.initialState.data) {
          /* Load data */
          this.pluginState = args.initialState.data;
      }
      else {
          /* Use default data */
          this.pluginState = {
              gain1: pluginConf.hostParameters.parameters.gain1.range.default,
              gain2: pluginConf.hostParameters.parameters.gain2.range.default
          };
      }

      for (param in this.pluginState) {
            if (this.pluginState.hasOwnProperty(param)) {
                args.hostInterface.setParm (param, this.pluginState[param]);
                onParmChange.apply (this, [param, this.pluginState[param]]);
            }
        }

      var saveState = function () {
          return { data: this.pluginState };
      };
      args.hostInterface.setSaveState (saveState);
      args.hostInterface.setHostCallback (onParmChange);

      // Initialization made it so far: plugin is ready.
      args.hostInterface.setInstanceStatus ('ready');
        
    };
    
    return {
        initPlugin: initPlugin,
        pluginConf: pluginConf
    };
});