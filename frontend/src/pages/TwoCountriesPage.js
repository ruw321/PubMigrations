import React from 'react';
import {
  Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider
} from 'antd'
import { Form, FormInput, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import {
  getPapersMoved2C,
  getBioentitiesMoved2c,
  getMovement2c,
  getSharedBioentities2c,
  getPapersBoth2c
} from '../fetcher'

const researchersColumns = [
  {
    title: 'ANDID',
    dataIndex: 'ANDID',
    key: 'ANDID',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'LastName',
    dataIndex: 'LastName',
    key: 'LastName',
    // sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'Initials',
    dataIndex: 'Initials',
    key: 'Initials',
    // sorter: (a, b) => a.Rating - b.Rating

  },
  {
    title: 'BeginYear',
    dataIndex: 'BeginYear',
    key: 'BeginYear',
    // sorter: (a, b) => a.Potential - b.Potential
  },
  {
    title: 'Employment',
    dataIndex: 'Employment',
    key: 'Employment',
    // sorter: (a, b) => a.Potential - b.Potential
  },
  {
    title: 'Education',
    dataIndex: 'Education',
    key: 'Education',
    // sorter: (a, b) => a.Potential - b.Potential
  },
  {
    title: 'Papers',
    dataIndex: 'Papers',
    key: 'Papers',
    // sorter: (a, b) => a.Potential - b.Potential
  }
];

class TwoCountriesPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,

      country1: '',
      country2: '',
      // researchersResults: []
      papersMoved2C: '',
      bioentitiesMoved2c: [],
      movement2c: '',
      sharedBioentities2c: [],
      papersBoth2c: []


    }

    this.handleCountry1Change = this.handleCountry1Change.bind(this);
    this.handleCountry2Change = this.handleCountry2Change.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);

  }

  handleCountry1Change(event) {
    this.setState({ country1: event.target.value });
  }

  handleCountry2Change(event) {
    this.setState({ country2: event.target.value });
  }

  updateSearchResults() {
    getPapersMoved2C(this.state.country1, this.state.country2).then(res => {
      this.setState({ papersMoved2C: res.results })
    })

    getBioentitiesMoved2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ bioentitiesMoved2c: res.results })
    })

    getMovement2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ movement2c: res.results })
    })

    getSharedBioentities2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ sharedBioentities2c: res.results })
    })

    getPapersBoth2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ papersBoth2c: res.results })
    })
  }

  componentDidMount() {

  }

  render() {
    if (window.localStorage.getItem('Authenticated') !== 'True') {
      // go back to the login page since you are not authenticated
      window.location = '/login';
    }
    return (
      <div>
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
          <Row>
            <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
              <label>Country 1</label>
              <FormInput placeholder="Country 1" value={this.state.country1} onChange={this.handleCountry1Change} />
            </FormGroup></Col>
            <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
              <label>Country 2</label>
              <FormInput placeholder="Country 2" value={this.state.country2} onChange={this.handleCountry2Change} />
            </FormGroup></Col>
            <Col flex={2}><FormGroup style={{ width: '10vw' }}>
              <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
            </FormGroup></Col>
          </Row>
        </Form>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Researchers</h3>
          <Table rowKey="ANDID" dataSource={this.state.researchersResults} columns={researchersColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 10, showQuickJumper: true }} />
        </div>
      </div>
    )
  }
}

export default TwoCountriesPage

