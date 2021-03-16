import {
  FormControl,
  MenuItem,
  Select,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import apiCaller from "./api/apiCaller";
import "./App.css";
import urls from "./constants/UrlConstants";
import globe from "./assets/green_globe_png.png";
import InfoBox from "./components/InfoBox";
import numeral from "numeral";
import { formatNumber } from "./utils/utils";

const theme = createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      input: {
        padding: "0px",
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: "none",
      },
    },
  },
});

const App = () => {
  const [countries, setCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});

  console.log("urlss", urls.GET_COUNTRIES);

  useEffect(() => {
    apiCaller("https://disease.sh/v3/covid-19/all", "")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    console.log("useEEEEEEEEEEEEe");
    const getCountriesData = async () => {
      apiCaller(`${urls.GET_COUNTRIES}`, "")
        .then((response) => {
          console.log("in app", response);
          return response.json();
        })
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          //  let sortedData = sortData(data);
          setCountries(countries);
          // setMapCountries(data);
          // setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    apiCaller(`${url}`, "")
      .then((response) => {
        console.log("in onChange", response);
        return response.json();
      })
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="app_header">
        {/* <h1>Covid-19 tracker</h1> */}
        <ThemeProvider theme={theme}>
          <Grid className="app_top">
            <Grid className="app_select_country">
              {/* <img src={globe} alt="Globe" /> */}
              <Card className="app_stats">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Stats overview
                  </Typography>
                  <FormControl className="app_dropdown">
                    <Select
                      variant="outlined"
                      value={country}
                      onChange={onCountryChange}
                    >
                      <MenuItem value="worldwide">Worldwide</MenuItem>
                      {countries.map((country) => (
                        <MenuItem value={country.value}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>{" "}
                  </FormControl>{" "}
                </CardContent>
              </Card>
              <InfoBox
                onClick={(e) => setCasesType("cases")}
                title="Total Coronavirus Cases"
                isRed
                active={casesType === "cases"}
                cases={formatNumber(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("recovered")}
                title="Total Recovered"
                active={casesType === "recovered"}
                cases={formatNumber(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
              />

              <InfoBox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                isRed
                active={casesType === "deaths"}
                cases={formatNumber(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
            </Grid>
          </Grid>
        </ThemeProvider>

        <Grid className="left"></Grid>
        <Grid className="right"></Grid>
      </div>
    </div>
  );
};

export default App;
