define([], function() {
  
  var pluginConf = {
      name: "HyDA",
      osc: false,
      audioOut: 2,
      audioIn: 1,
      version: '0.0.1-alpha1'
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

      // Initialization made it so far: plugin is ready.
      args.hostInterface.setInstanceStatus ('ready');
        
    };
    
    return {
        initPlugin: initPlugin,
        pluginConf: pluginConf
    };
});