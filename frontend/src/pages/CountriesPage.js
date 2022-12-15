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
    sorter: (a, b) => a.Country.localeCompare(b.Country),
  },
  {
    title: 'NumPapers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
    sorter: (a, b) => a.NumPapers - b.NumPapers
  }
];

const topInstitutionsByCountryColumns = [
  {
    title: 'Country',
    dataIndex: 'Country',
    key: 'Country',
    sorter: (a, b) => a.Country.localeCompare(b.Country),
  },
  {
    title: 'NumPapers',
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
    title: 'Count',
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
      loadingPaperByCountries: true,
      loadingTopInstituteByCountry: true,
      loadingTopBioEdByCountry: true,
      loadingMostEmployedCities: true,
      
      countries: [],
      papersByCountries: [],
      topInstituteByCountry: [],
      topBioEdByCountry: [],
      mostEmployedCities: []
    }

    this.goToMatch = this.goToMatch.bind(this)
    this.handleCountryQueryChange = this.handleCountryQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)

  }

  // const [loading, setLoading] = useState();

  handleCountryQueryChange(value) {
    console.log("value here:", value.value)
    this.setState({ country: value.value })
  }

  updateSearchResults() {
    this.setState({loadingTopInstituteByCountry: true})
    this.setState({loadingTopBioEdByCountry: true})
    console.log("start", this.state.loadingTopBioEdByCountry);
    getTopInstituteByCountry(this.state.country, null, null).then( res => {
        this.setState({ topInstituteByCountry: res.results })
        this.setState({loadingTopInstituteByCountry: false})
    })
    getTopBioEdByCountry(this.state.country, null, null).then( res => {
      this.setState({ topBioEdByCountry: res.results })
      this.setState({loadingTopBioEdByCountry: false})
    })

    console.log("done",this.state.loadingTopBioEdByCountry);

    console.log('done with updating search results');
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  componentDidMount() {
    getAllCountries(null, null).then(res => {
      console.log(res.results)
      let newResults = [];
      for (let i in res.results){
        console.log(i);
        let label = res.results[i].Name;
        let value = res.results[i].Alpha2Code;
        let d = {label: label, value: value};
        newResults.push(d);
      }
      console.log(newResults);
      this.setState({ countries: newResults})
      console.log('set state')
    })

    getTotalPapersByCountry(null, null).then(res => {
      console.log(res.results)
      this.setState({ papersByCountries: res.results})
      console.log('set state')
      this.setState({loadingPaperByCountries: false})
      console.log('set loading to false')
    })

    getTopInstituteByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      this.setState({ topInstituteByCountry: res.results})
      console.log('set state')
      this.setState({loadingTopInstituteByCountry: false})
    })

    getTopBioEdByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      this.setState({ topBioEdByCountry: res.results})
      console.log('set state')
      this.setState({loadingTopBioEdByCountry: false})
    })

    getMostEmployedCities(null, null).then(res => {
      console.log(res.results)
      this.setState({ mostEmployedCities: res.results})
      console.log('set state')
      this.setState({loadingMostEmployedCities: false})
    })

  }

  render() {
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }

    return (
      <div style={{ display: 'flex', height: '100%' }}>
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
        <h3>Total Papers By Country</h3>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingPaperByCountries}} dataSource={this.state.papersByCountries} columns={papersByCountriesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Top Institutions By Country</h3>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingTopInstituteByCountry}} dataSource={this.state.topInstituteByCountry} columns={topInstitutionsByCountryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Top Education By Country</h3>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingTopBioEdByCountry}} dataSource={this.state.topBioEdByCountry} columns={topBioEdByCountryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Most Employed Cities</h3>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingMostEmployedCities}} dataSource={this.state.mostEmployedCities} columns={mostEmployedCitiesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      
      </div>
    </div>
    )
  }
}

export default CountriesPage

