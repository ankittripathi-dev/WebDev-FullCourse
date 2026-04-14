### useEffect Hook
- Used to handle side effects in functional Components.
- Side Effect is any operation that affects something outside the scope of a function.

##### Why useEffect are used
- (1) Fetching data from an API
- (2) Updating the DOM directly
- (3) Working With Event listeners
- (4) Working with timers (setTimeout, setInterval)


#### Explanation
- (1) Effect function –> runs after the component renders.
- (2) Cleanup function (optional) –> runs before the component unmounts or before re-running the effect.
- (3) Dependency array –> controls when the effect runs:
```
No array → run on every render.
[] → run once when the component mounts
[state, props] → runs every time when specified values change.
```


### Syntax
```
 useEffect(() => {
   // your side effect code  here

  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);

 first -> side effect function
 second -> clean-up function
 third -> comma separated dependency list

```


##### Normally, Cleanup Function se kya hoga
- (1) Background ka kaam stop ho jaayega (intervals, timeouts, subscriptions).
- (2) Event listeners safely remove ho jaayenge.
- (3) Memory leaks aur unnecessary updates avoid ho jaayenge.
- (4) App lightweight & bug-free rahega.


##### Shortcut Yaad Rakho
- (1) useEffect --> kuchh kaam shuru karna (side-effect).
- (2) cleanup function --> us kaam ko rokna jab zaroorat na ho.
