import React from 'react';
import {
  Table,
  Row,
  Col,
  Spin
} from 'antd'
import Select from 'react-select';
import { Form, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getAllCountries, getMostEmployedCities, getTopBioEdByCountry, getTopInstituteByCountry, getTotalPapersByCountry } from '../fetcher'

const papersByCountriesColumns = [
  {
    title: 'Country',
    dataIndex: 'Country',
    key: 'Country',
    // sorter: (a, b) => a.Country.localeCompare(b.Country),
  },
  {
    title: 'Number of papers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
    // sorter: (a, b) => a.NumPapers - b.NumPapers
  }
];

const topInstitutionsByCountryColumns = [
  {
    title: 'Number of papers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
    sorter: (a, b) => a.NumPapers - b.NumPapers
  },
  {
    title: 'Organization',
    dataIndex: 'Organization',
    key: 'Organization',
    sorter: (a, b) => a.Organization.localeCompare(b.Organization),
  }
];

const topBioEdByCountryColumns = [
  {
    title: 'Mention',
    dataIndex: 'Mention',
    key: 'Mention',
    sorter: (a, b) => a.Mention.localeCompare(b.Mention),
  },
  {
    title: 'Count',
    dataIndex: 'Count',
    key: 'Count',
    sorter: (a, b) => a.Count - b.Count
  }
];

const mostEmployedCitiesColumns = [
  {
    title: 'City',
    dataIndex: 'City',
    key: 'City',
    sorter: (a, b) => a.City.localeCompare(b.City),
  },
  {
    title: 'Employed Researchers',
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count
  }
];

class CountriesPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,
      country: "",
      loadingPaperByCountries: false,
      loadingTopInstituteByCountry: false,
      loadingTopBioEdByCountry: false,
      loadingMostEmployedCities: false,

      countries: [],
      papersByCountries: [],
      topInstituteByCountry: [],
      topBioEdByCountry: [],
      mostEmployedCities: []
    }

    this.handleCountryQueryChange = this.handleCountryQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)

  }

  // const [loading, setLoading] = useState();

  handleCountryQueryChange(value) {
    console.log("value here:", value.value)
    this.setState({ country: value.value })
  }

  updateSearchResults() {

    this.setState({ loadingPaperByCountries: true });
    getTotalPapersByCountry(this.state.country).then(res => {
      console.log(res.results)
      this.setState({ papersByCountries: res.results })
      this.setState({ loadingPaperByCountries: false })
    })

    this.setState({ loadingTopInstituteByCountry: true })
    getTopInstituteByCountry(this.state.country).then(res => {
      console.log(res.results)
      this.setState({ topInstituteByCountry: res.results })
      this.setState({ loadingTopInstituteByCountry: false })
    })

    this.setState({ loadingTopBioEdByCountry: true })
    getTopBioEdByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      this.setState({ topBioEdByCountry: res.results })
      this.setState({ loadingTopBioEdByCountry: false })
    })

    this.setState({ loadingMostEmployedCities: true })
    getMostEmployedCities(this.state.country).then(res => {
        console.log(res.results)
        this.setState({ mostEmployedCities: res.results })
        this.setState({ loadingMostEmployedCities: false })
      })
  }


  componentDidMount() {
    getAllCountries(null, null).then(res => {
      console.log(res.results)
      let newResults = [];
      for (let i in res.results) {
        let label = res.results[i].Name;
        let value = res.results[i].Alpha2Code;
        let d = { label: label, value: value };
        newResults.push(d);
      }
      console.log(newResults);
      this.setState({ countries: newResults })
      console.log('set state')
    })
  }

  render() {
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
      <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Country</label>
                <Select style={{ width: '20vw', margin: '0 auto' }} defaultValue="" options={this.state.countries} onChange={this.handleCountryQueryChange}></Select>
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form>
          <h3>Total papers</h3>
          <h6> Number of papers produced by a given country. A paper is produced by a country if the author of the paper is located in the country when the paper was published</h6>
          <Table rowKey="Country" className="my-4" bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingPaperByCountries }} dataSource={this.state.papersByCountries} columns={papersByCountriesColumns} pagination={{hideOnSinglePage:true}} />
          <h3>Top institutions by number of papers</h3>
          <h6> Most prolific institutions in every country by number of papers</h6>
          <Table rowKey="Organization" className="my-4" bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingTopInstituteByCountry }} dataSource={this.state.topInstituteByCountry} columns={topInstitutionsByCountryColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
          <h3>Top bioentities/terms researched</h3>
          <h6> Top words mentioned in all papers from this country</h6>
          <Table rowKey="Mention" className="my-4" bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingTopBioEdByCountry }} dataSource={this.state.topBioEdByCountry} columns={topBioEdByCountryColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
          <h3>Cities employing the most researchers</h3>
          <h6> Cities with the most employment by number of authors</h6>
          <Table rowKey="City" className="my-4" bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning: this.state.loadingMostEmployedCities }} dataSource={this.state.mostEmployedCities} columns={mostEmployedCitiesColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />

        </div>
      </div>
    )
  }
}

export default CountriesPage

