import React from 'react';
import {
  Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider
} from 'antd'
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getAllCountries, getMostEmployedCities, getTopBioEdByCountry, getTopInstituteByCountry, getTotalPapersByCountry } from '../fetcher'

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const papersByCountriesColumns = [
  {
    title: 'Country',
    dataIndex: 'Country',
    key: 'Country',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'NumPapers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  }
];

const topInstitutionsByCountryColumns = [
  {
    title: 'Country',
    dataIndex: 'Country',
    key: 'Country',
  },
  {
    title: 'NumPapers',
    dataIndex: 'NumPapers',
    key: 'NumPapers',
  },
  {
    title: 'Organization',
    dataIndex: 'Organization',
    key: 'Organization',
  }
];

const topBioEdByCountryColumns = [
  {
    title: 'Mention',
    dataIndex: 'Mention',
    key: 'Mention',
  },
  {
    title: 'Count',
    dataIndex: 'Count',
    key: 'Count',
  }
];

const mostEmployedCitiesColumns = [
  {
    title: 'City',
    dataIndex: 'City',
    key: 'City',
  },
  {
    title: 'count',
    dataIndex: 'count',
    key: 'count',
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
      country: "IT",
      
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

  handleCountryQueryChange(value) {
    console.log("value here:", value)
    this.setState({ country: value })
  }

  updateSearchResults() {
    getTopInstituteByCountry(this.state.country, null, null).then( res => {
        this.setState({ topInstituteByCountry: res.results })
    })
    getTopBioEdByCountry(this.state.country, null, null).then( res => {
      this.setState({ topBioEdByCountry: res.results })
    })
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
      // TASK 1: set the correct state attribute to res.results
      this.setState({ countries: newResults})
      console.log('set state')
    })

    getTotalPapersByCountry(null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ papersByCountries: res.results})
      console.log('set state')
    })

    getTopInstituteByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ topInstituteByCountry: res.results})
      console.log('set state')
    })

    getTopBioEdByCountry(this.state.country, null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ topBioEdByCountry: res.results})
      console.log('set state')
    })

    getMostEmployedCities(null, null).then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({ mostEmployedCities: res.results})
      console.log('set state')
    })

  }

  render() {
    return (
      <div>
      <MenuBar />
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
      <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Country</label>
                    <Select defaultValue="" options={this.state.countries} onChange={this.handleCountryQueryChange}></Select>
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
        <h3>Total Papers By Country</h3>
        <Table dataSource={this.state.papersByCountries} columns={papersByCountriesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Top Institutions By Country</h3>
        <Table dataSource={this.state.topInstituteByCountry} columns={topInstitutionsByCountryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Top Education By Country</h3>
        <Table dataSource={this.state.topBioEdByCountry} columns={topBioEdByCountryColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        <h3>Most Employed Cities</h3>
        <Table dataSource={this.state.mostEmployedCities} columns={mostEmployedCitiesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      
      </div>
    </div>
    )
  }
}

export default CountriesPage

