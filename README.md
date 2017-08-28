# Type-Storage

**We know that Cookie and Web Storage (such as Session Storage and Local Storage) can only store strings, this simple module let you handle Object, Array and other types to be stored and retrieved in them.**

# Install

```sh
npm install type-storage
```

# Example

```html
<script src="storage.js"></script>

<sciprt>
storage("a", {A: "Hello", B: "World"}); //Object
storage("b", ["Hello", "World"]); //Array

//Or use cookie

cookie("c", storage("a")); //storage("a") returns the Object.
cookie("d", storage("b")); //storage("b") returns the Array.
</sciprt>
```

Or in WebPack

```javascript
import {storage, cookie} from "storage";

storage("a", {A: "Hello", B: "World"}); //Object
storage("b", ["Hello", "World"]); //Array

//Or use cookie

cookie("c", storage("a")); //storage("a") returns the Object.
cookie("d", storage("b")); //storage("b") returns the Array.

console.log(storage()); //Prints what's in Storage.
console.log(cookie()); //Prints what's in Cookie.

console.log(storage().length); //Prints length of Storages.
console.log(cookie().length); //Prints length of Cookies.
```

## storage()

**params:**

- `key` The storage name.
- `value` The storage data, if an `undefined` is passed, remove the previous data.
- `local` Store in localStorage instead of sessionStorage, default is `false`.

**return:**

If both `key` and `value` are passed, alway returns the value;
if only `key` is passed, returns the value it represents, or undefined.

## cookie()

**This function is similiar to `storage()`, only it stores data in cookies, and if the third argument passes a `true`, it stores data only in one year.**
