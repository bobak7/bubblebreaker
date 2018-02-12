function BubbleStorage() {
    
    this.storage = {};
    
    this.toKey = function (bubble) {
        return JSON.stringify({x: bubble.x, y: bubble.y});
    };
    
    this.size = function () {
        return Object.keys(this.storage).length;
    };
    
    this.isEmpty = function () {
        return this.size() < 1;
    };
    
    this.add = function (bubble) {
        this.storage[this.toKey(bubble)] = bubble;
    };
    
    this.contains = function (bubble) {
        return this.toKey(bubble) in this.storage;
    };
    
    this.getBubble = function (pos) {
        return this.storage[this.toKey(pos)];
    };
    
    this.getAll = function () {
        var result = Object.keys(this.storage);
        var i = 0;
        for (i = 0; i < result.length; i++) {
            result[i] = this.storage[result[i]];
        }
        return result;
    };
    
    this.remove = function (bubble) {
        delete this.storage[this.toKey(bubble)];
    };
    
    this.clear = function () {
        this.storage = {};
    };
    
}