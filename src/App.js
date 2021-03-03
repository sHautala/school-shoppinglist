import './App.css';
import { useState, useEffect } from 'react';

const URL = "http://localhost/koulu/shoppinglist-backend/";

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amounts, setAmounts] = useState([]);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    let status = 0;
    fetch(URL + 'index.php')
      .then(res => {
        status = parseInt(res.status);
        return res.json()
      })
      .then(
        (res) => {
          if (status === 200) {
            setItems(res);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'add.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: item, amount
      })
    })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setItems(items => [...items, res]);
            setItem('');
            setAmounts(amounts => [...amounts, res]);
            setAmount('');
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }

  function remove(id) {
    let status = 0;
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            const newListWithoutRemoved = items.filter((item) => item.id !== id);
            setItems(newListWithoutRemoved);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <div>
        <form onSubmit={save}>
          <label>New item</label>
          <input value={item} onChange={e => setItem(e.target.value)} placeholder="type description" maxLength="20" />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="type amount" max="5000" />
          <button>Add</button>
        </form>
      </div>
      <ol className="list">
        {items.map(item =>
          <li key={item.id}>
            {item.description}
            <div className="amount">
              {item.amount}
            </div>
            <a onClick={() => remove(item.id)} href="#">Delete</a>

          </li>)}
      </ol>
    </div>
  );
}

export default App;
