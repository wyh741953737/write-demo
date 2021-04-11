import React, { useState,useCallback,useRef, useEffect } from "react";
 import ReactDOM from "react-dom";


// const App = () => {
//   const [temp, setTemp] = React.useState(5);

//   const log = () => {
//     setTimeout(() => {
//       console.log("3 秒前 temp = 5，现在 temp =", temp);
//     }, 1000);
//   };

//   return (
//     <div
//       onClick={() => {
//         log();
//         setTemp(3);
//       }}
//     >
//       xyz
//     </div>
//   );
// };



 function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

function Example() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
    setTimeout(() => {
      console.log(`You clicked ${latestCount.current} times ${count}`);
    }, 1000);
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((count) => count + 1)}>Click me</button>
    </div>
  );
}

function App() {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (value === 0) {
            setValue(10 + Math.random() * 200);
        }
      }, [value]);
    const test = () => {
        setValue(0)
    }
    const color = !value  ? 'red' : 'yellow'
	return (
		<React.Fragment>
            <p style={{ background: color}}>value: {value}</p>
			<button onClick={test}>点我</button>
		</React.Fragment>
	);
}


 const rootElement = document.getElementById("root");
 ReactDOM.render(<App />, rootElement);