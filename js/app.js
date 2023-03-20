document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, {
        data: {
            "北京": null,
            "上海": null,
            "广州": null,
            "New York": null,
            "Atlanta": null,
            "San Francisco": null,
        }
    });
});