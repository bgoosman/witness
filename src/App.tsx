import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { Filters } from "./components/filters";
import { Timeline } from "./components/timeline";
import { RootStore } from "./stores/root-store";
import { AboutPage } from "./components/about";
import { AppLayout } from "./components/app-layout";
import { TagEventPage } from "./components/tag-event";

function App() {
  const rootStore = new RootStore();
  const { eventStore } = rootStore;

  return (
    <Router>
      <Switch>
        <Route path="/tag">
          <AppLayout sidebar={null}>
            <TagEventPage eventStore={eventStore} />
          </AppLayout>
        </Route>
        <Route path="/about">
          <AppLayout sidebar={null}>
            <AboutPage />
          </AppLayout>
        </Route>
        <Route path="/">
          <AppLayout sidebar={<Filters eventStore={eventStore} />}>
            <Timeline eventStore={eventStore} />
          </AppLayout>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
