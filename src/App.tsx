import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Container rate={50} amount={50000} rateStep={10} maxPacNumber={5}/>
    </div>
  );
}

function Container(props: any) {
  const data = [
    {key: "Amount", value: props.amount},
    {key: "Rate", value: props.rate},
    {key: "Rate Amount", value: props.maxPacNumber},
  ]
  return (
    <div className='container'>
      <RightBar data={data}/>
      <input className='button' type="button" value="Save" />
      <Items rate={props.rate} amount={props.amount} rateStep={props.rateStep} maxPacNumber={props.maxPacNumber}/>
    </div>
  );
}

interface ItemContent {
  id: number;
  amount: number;
  rate: number;
}

function Items(props: any){

  const [items, setItems] = useState<ItemContent[]>([]);
  const refArray = useRef<ItemHandles[]>([]);

  function handleClick() {
    if(items.length < props.maxPacNumber) {
      let totalRate = 0;
      refArray.current.forEach(r => {
        totalRate = totalRate + r.rate;
      });
      debugger;
      setItems([...items, {id: items.length, rate:0 ,amount: 0}])
    }
  }

  function handleChange(id: number, newRate: number, newAmount: number) {
    console.log(`${id}: ${newRate} => ${newAmount}`)
  }

  return (
    <div className='items'>
      <input className='add-button' value="Add" type="button" onClick={handleClick} />
      <p className='info-text'>Information: -</p>
      <div className="items-table">
        <div className='table-header'>
          <div>Col1</div>
          <div>Col2</div>
          <div>Col3</div>
          <div>Col4</div>
        </div>
        {items.map((i: any, id: number )=> (
          <Item 
            key={id}
            onChange={() => { } }
            ref={(ref: ItemHandles) => { refArray.current[id] = ref} }
            amount={70000}
            max={70}
            step={5} 
            index={0}          
          />
        ))}
      </div>
    </div>
  );
}

interface ItemProps {
  amount: number;
  step: number;
  max: number;
  index: number;
  onChange: (id: number, rate: number, amount: number) => void;
}

interface ItemHandles {
  amount: number;
  rate: number;
  max: number;
}

const Item = React.forwardRef<ItemHandles, ItemProps>((props, ref) => {
  const[amount, setAmount] = useState<number>(0);
  const numberSelectorRef = useRef<NumberSelectorHandles>(null);

  useImperativeHandle(ref, () => {
    return {
      set amount(value: number) {

      },
      set rate(value: number) {
        numberSelectorRef.current!.value = value;
      },
      get rate(): number {
        return numberSelectorRef.current!.value;
      },
      set max(value: number) {

      },
    }
  })

  function handleChange(rate: number) {
    const amount = props.amount * (rate / props.max)
    setAmount(amount);
    props.onChange(props.index, rate, amount);
  }

  return (
    <div className='item'>
      <div><SelectBox /></div>
      <div><SelectBox /></div>
      <div>
        <NumberSelector
          ref={numberSelectorRef}
          max={props.max} 
          step={props.step} 
          onChange={handleChange}/>
      </div>
      <div>{amount}</div>
    </div>
  );
});

function RightBar(props: any) {
  return (
    <div className='right-bar'>
      {props.data.map((t: any, i: number) => (
        <div key={i}>
          <p>{t.key}</p>
          <p>{t.value}</p>
          {(i+1) !== props.data.length && <hr></hr>}
        </div>
      ))}
    </div>
  );
}

interface SelectBoxHandles {

}

interface SelectBoxProps {

}

const SelectBox = React.forwardRef<SelectBoxHandles, SelectBoxProps>((props, ref) => {
  
  return (
    <select name="swiftcode" id="swift-select" style={{width: "100px"}}>
      <option value="">--Please choose an option--</option>
      <option value="USD">USD</option>
      <option value="TRY">TRY</option>
      <option value="EUR">EUR</option>
      <option value="JPY">JPY</option>
      <option value="GBP">GBP</option>
      <option value="A02">A02</option>
    </select>
  );
});

interface NumberSelectorHandles {
  value: number;
}

interface NumberSelectorProps {
  onChange: (value: number) => void;
  max: number;
  step: number;
}

const NumberSelector = React.forwardRef<NumberSelectorHandles, NumberSelectorProps>((props, ref) => {
  const [value, setValue] = useState<number>(0);

  useImperativeHandle(ref, () => {
    return {
      get value(): number {
        return value
      },
      set value(val: number) {
        setValue(val)
      }
    }
  })
  
  useEffect(() => {
    props.onChange(value)
  }, [value])
  
  return (
    <div>
    <input type={"button"} value={"-"} onClick={() => {value > 0 && setValue(value - props.step)}}/>
    %<input disabled={true}  style={{width: "32px",}} type={"number"}  value={value}/>
    <input type={"button"} value={"+"} onClick={() => {value < props.max && setValue(value + props.step)}}/>
    </div>
  );
})

export default App;
