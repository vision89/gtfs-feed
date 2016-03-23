(function(document) {
  'use strict';

  var fileNames = [

    {
      file: 'agency.txt',
      prop: 'agency'
    },
    {
      file: 'stops.txt',
      prop: 'stops'
    },
    {
      file: 'routes.txt',
      prop: 'routes'
    },
    {
      file: 'trips.txt',
      prop: 'trips'
    },
    {
      file: 'stop_times.txt',
      prop: 'stop_times'
    },
    {
      file: 'calendar.txt',
      prop: 'calendar'
    },
    {
      file: 'calendar_dates.txt',
      prop: 'calendar_dates'
    },
    {
      file: 'fare_attributes.txt',
      prop: 'fare_attributes'
    },
    {
      file: 'fare_rules.txt',
      prop: 'fare_rules'
    },
    {
      file: 'shapes.txt',
      prop: 'shapes'
    },
    {
      file: 'frequencies.txt',
      prop: 'frequencies'
    },
    {
      file: 'transfers.txt',
      prop: 'transfers'
    },
    {
      file: 'feed_info.txt',
      prop: 'feed_info'
    }

  ];

  Polymer({
    is: 'gtfs-feed',

    properties: {

      /**
       * If set to true parse will automatically be called when files are updated
       * @type {Object}
       */
      autoParse: {

        type: Boolean,
        value: false,
        notify: false

      },
      
      /**
       * The list of gtfs files
       * @type {Object}
       */
      files: {

        type: Array,
        value: [],
        notify: false,
        observe: '_tryParse'

      },

      /**
       * The json to return
       * @type {Object}
       */
      json: {

        type: Object,
        value: Object.create(null),
        notify: true

      },

      /**
       * XML to parse as json
       * @type {String}
       */
      xml: {

        type: String,
        value: '',
        notify: false,
        observe: '_tryParseXML'

      }

    },

    /**
     * Parses files if autoParse is on
     * 
     */
    _tryParse: function() {

      if(this.autoParse && this.files.length > 0) {

        this.parseFiles();

      }

    },

    /**
     * Parses xml if autoParse is on
     * 
     */
    _tryParseXML: function() {

      if(this.autoParse && this.xml) {

        this.parseXML();

      }

    },

    /**
     * Parse files into gtfs json
     * 
     */
    parseFiles: function() {

      var that = this;
      var tally = 0;
      var total = that.files.length;
      that.set( 'json', Object.create(null) );

      try {

        that.files.forEach(function(url) {

          var prop = '';

          for(var i = 0; i < fileNames.length; ++i) {

            if(url.endsWith(fileNames[i].file)) {

              prop = fileNames[i].prop;

            }

          }

          if(prop) {

            that.csv = Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            before: function(url, inputElem)
              {
                // executed before parsing each file begins;
                // what you return here controls the flow
              },
              error: function(err, file, inputElem, reason)
              {
                // executed if an error occurs while loading the file,
                // or if before callback aborted for some reason
                
                //Notify the user of the error
                that.fire('error', err); 

                //Still counts against our files
                ++tally;

                //If this is the last file alert the parent
                if(tally === total) {

                  that.fire('json-updated');

                }

              },
              complete: function(results)
              {
                // executed after all files are complete
                that.set( 'json.' + prop, results.data );

                //If this is the last file alert the parent
                ++tally;
                if(tally === total) {

                  that.fire('json-updated');

                }

              }
            });

          } else {

            that.fire('error', 'File does not conform to gtfs standard');

          }

        });

      } catch( err ) {

        that.fire('error', err);

      }

    },

    /**
     * Parse xml to json
     * 
     */
    parseXML: function() {

      var that = this;

      try {

        var vals = xmlToJSON.parseString(that.xml);

        that.set( 'json', Object.create(null));

        var updated = false;

        if(vals.RTT && vals.RTT.length > 0 && vals.RTT[0].AgencyList && vals.RTT[0].AgencyList.length > 0 && vals.RTT[0].AgencyList[0] && vals.RTT[0].AgencyList[0].Agency) {
            
          that.set('json.agencyList', vals.RTT[0].AgencyList[0].Agency);
          that.fire('json-updated');

        }

      } catch(err) {

        that.fire('error', err);

      }

    },

    // Element Lifecycle

    ready: function() {
      // `ready` is called after all elements have been configured, but
      // propagates bottom-up. This element's children are ready, but parents
      // are not.
      //
      // This is the point where you should make modifications to the DOM (when
      // necessary), or kick off any processes the element wants to perform.
    },

    attached: function() {
      // `attached` fires once the element and its parents have been inserted
      // into a document.
      //
      // This is a good place to perform any work related to your element's
      // visual state or active behavior (measuring sizes, beginning animations,
      // loading resources, etc).

    },

    detached: function() {
      // The analog to `attached`, `detached` fires when the element has been
      // removed from a document.
      //
      // Use this to clean up anything you did in `attached`.
    },

    // Element Behavior

  });

})(document);