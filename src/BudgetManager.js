import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./App";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BudgetTabs from "./BudgetTabs";
import axios from "axios";
import BudgetTable from "./BudgetTable";
import AddNew from "./AddNew";
import BudgetTotals from "./BudgetTotals";
import useMediaQuery from "@material-ui/core/useMediaQuery";
const _ = require("lodash");

function BudgetManager(props) {
  const themes = useContext(ThemeContext);
  const [bills, setBills] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [everythingElse, setEverythingElse] = useState([]);
  const [newRecord, setNewRecord] = useState({});
  const [postRequestTarget, setPostRequestTarget] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const billsNames = ["Bill Name", "Amount Due", "Merchant", "Date Due"];
  const expensesNames = ["Expense Name", "Amount Needed", "Date Needed By"];
  const everyThingElseNames = ["Name", "Amount", "Date"];
  const matches = useMediaQuery("(max-width:850px)");
  const nextPoint = useMediaQuery("(max-width:650px)");

  const useStyles = makeStyles((theme) => ({
    paper: {
      display: "flex",
      flexDirection: "column",
      width: matches === true ? "95%" : "70%",
      height: "100%",
      alignItem: "center",
      textAlign: "center",
      marginTop: nextPoint === true ? "60px" : "20px",
      marginLeft: matches === true ? "0" : "20px",
      backgroundColor: themes === true ? "#393e46" : "#FFFFFF",
      marginBottom: themes === true ? "100px" : "0",
    },
    tabs: {
      display: "flex",
      flexDirection: "row",
      height: "20px",
    },
  }));

  useEffect(() => {
    const addingNewRecord = async () => {
      const res = await axios.post(
        `https://api.airtable.com/v0/app3uPKaYM48ftzIO/${postRequestTarget}`,

        newRecord,

        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
    };
    addingNewRecord();
  }, [postRequestTarget]);

  let changeObj = {};
  let arrForInput = [];

  const handleChange = (e, index) => {
    changeObj = {
      typedIn: e.target.value,
      category: index,
    };
  };

  const handleBlur = () => {
    if (!_.isEmpty(changeObj)) {
      arrForInput.push(changeObj);
    }
    changeObj = {};
  };

  const dataFromAddNew = async (e) => {
    e.preventDefault();

    if (arrForInput[0].category === "Bill Name") {
      const record = {
        fields: {
          name: `${arrForInput[0].typedIn}`,
          amount: `${arrForInput[1].typedIn}`,
          whomTo: `${arrForInput[2].typedIn}`,
          dueDate: `${arrForInput[3].typedIn}`,
          completed: "false",
        },
      };
      setNewRecord(record);
      setPostRequestTarget("Bills");
    } else if (arrForInput[0].category === "Expense Name") {
      console.log(parseInt(arrForInput[1].typedIn));
      const record = {
        fields: {
          name: `${arrForInput[0].typedIn}`,
          amount: `${arrForInput[1].typedIn}`,
          dateNeededBy: `${arrForInput[2].typedIn}`,
          completed: "false",
        },
      };
      setNewRecord(record);
      setPostRequestTarget("Expenses");
    } else if (arrForInput[0].category === "Name") {
      const record = {
        fields: {
          name: `${arrForInput[0].typedIn}`,
          amount: `${arrForInput[1].typedIn}`,
          dateNeededBy: `${arrForInput[2].typedIn}`,
          completed: "false",
        },
      };
      setNewRecord(record);
      setPostRequestTarget("everything");
    }
  };

  const dataForAddNew = () => {
    if (selectedTab === 0) {
      return (
        <>
          <AddNew
            data={billsNames}
            getData={dataFromAddNew}
            handle={handleChange}
            blur={handleBlur}
          />
          {(arrForInput = [])}
        </>
      );
    } else if (selectedTab === 1) {
      return (
        <>
          <AddNew
            data={expensesNames}
            getData={dataFromAddNew}
            handle={handleChange}
            blur={handleBlur}
          />
          {(arrForInput = [])}
        </>
      );
    } else {
      return (
        <>
          <AddNew
            data={everyThingElseNames}
            getData={dataFromAddNew}
            handle={handleChange}
            blur={handleBlur}
          />
          {(arrForInput = [])}
        </>
      );
    }
  };

  const classes = useStyles();

  useEffect(() => {
    const apiCall = async () => {
      const billsData = await axios(
        "https://api.airtable.com/v0/app3uPKaYM48ftzIO/Bills",
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
          },
        }
      );
      const expensesData = await axios(
        "https://api.airtable.com/v0/app3uPKaYM48ftzIO/Expenses",
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
          },
        }
      );
      const everyThingElseData = await axios(
        "https://api.airtable.com/v0/app3uPKaYM48ftzIO/everything",
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
          },
        }
      );
      setBills(billsData.data.records);
      setExpenses(expensesData.data.records);
      setEverythingElse(everyThingElseData.data.records);
      props.sendData(
        billsData.data.records,
        expensesData.data.records,
        everyThingElseData.data.records
      );
    };
    apiCall();
  }, [postRequestTarget]);

  props.sendTab(selectedTab);

  return (
    <>
      <Paper className={classes.paper} elevation={2}>
        <BudgetTabs changeCategory={setSelectedTab} />
        {selectedTab === 0 && (
          <>
            <BudgetTable data={bills} header={billsNames} />
            <BudgetTotals data={bills} />
          </>
        )}
        {selectedTab === 1 && (
          <>
            <BudgetTable data={expenses} header={expensesNames} />
            <BudgetTotals data={expenses} />
          </>
        )}
        {selectedTab === 2 && (
          <>
            <BudgetTable data={everythingElse} header={everyThingElseNames} />
            <BudgetTotals data={everythingElse} />
          </>
        )}

        {dataForAddNew()}
      </Paper>
    </>
  );
}

export default BudgetManager;
