import React, { Component } from "react";
import { Table, TableData } from "@finos/perspective";
import { ServerRespond } from "./DataStreamer";
import { DataManipulator } from "./DataManipulator";
import "./Graph.css";

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement("perspective-viewer");
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = (document.getElementsByTagName(
      "perspective-viewer"
    )[0] as unknown) as PerspectiveViewerElement;
    //here we are modifying the schema obj so it changes Perspective table view of our graph
    const schema = {
      stock: "string",
      top_ask_price: "float",
      top_bid_price: "float",
      timestamp: "date",
      lower_bound: "float",
      upper_bound: "float",
      trigger_alert: "float",
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      //we are adding upper lower bound and tringger alert here
      elem.load(this.table);
      elem.setAttribute("view", "y_line");
      //here i removed column-pivote becouse we are concentrate on ratio of two stocks
      elem.setAttribute("row-pivots", '["timestamp"]');
      elem.setAttribute("columns", '["top_ask_price"]');
      elem.setAttribute(
        "aggregates",
        JSON.stringify({
          stock: "distinctcount",
          top_ask_price: "avg",
          top_bid_price: "avg",
          timestamp: "distinct count",
          lower_bound: "avg",
          upper_bound: "avg",
          trigger_alert: "avg",
        })
      );
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(([
        DataManipulator.generateRow(this.props.data),
      ] as unknown) as TableData);
    }
  }
}

export default Graph;