import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Fibonacci } from "./Fibonacci";
import { OtherPage } from "./OtherPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header" style={{ display: "flex", gap: "8px" }}>
          <Link to="/">Home</Link>
          <Link to="/other-page">Other Page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fibonacci} />
          <Route path="/other-page" component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
