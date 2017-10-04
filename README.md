TheThingsNetwork Console Decoder for Adeunis LoRaWAN Field Test Devices
=======================================================================

This code decodes the payload of
[Adeunis LoRaWAN Field Test Devices](https://www.adeunis.com/en/produit/ftd-868-915-2/)
and can be used as a payuload decoder on the
[TheThingsNetwork Console](https://console.thethingsnetwork.org/).

How To Use This Decoder?
------------------------

Log into the
[TheThingsNetwork Console](https://console.thethingsnetwork.org/),
choose "Application", then the application you use with your Adeunis
LoRaWAN Field Test Device(s). Then open the "Payload Formats" tab and
in there the "decoder" tab, i.e. go to
`https://console.thethingsnetwork.org/applications/…/payload-formats`
with `…` replaced with your application.

Then paste the code from `decoder.js` into the text area and save the
settings.

### Used JavaScript Variant

If you want to extent or modify the JavaScript code for your own use,
please be aware that this code needs to run on
[Otto](https://github.com/robertkrimen/otto), an ES5-compatible
JavaScript interpreter written in the Go programming language. It's
neither Node.js nor your browser's JavaScript engine which runs that
code.

See
[this thread in the TheThingsNetwork forums](https://www.thethingsnetwork.org/forum/t/payload-functions/5277).

History
-------

This code is based on a decoder written for Node-RED by
[Stuart Lowe](http://strudel.org.uk/) and published
[here](https://www.thethingsnetwork.org/community/leeds-bradford/post/things-coverage-map)
and [here](http://odileeds.org/blog/2017-02-28-things-coverage-map).

License
-------

After an initially unclear license of the original code,
[the license has been clarified on Twitter](https://twitter.com/thomasforth/status/915663824082100224)
to be the [MIT License](https://spdx.org/licenses/MIT.html).
