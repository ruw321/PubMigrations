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
  }
];

const sharedBioEntitiesColumns = [
  {
    title: 'Mention',
    dataIndex: 'Mention',
    key: 'Mention',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'Count',
    dataIndex: 'Count',
    key: 'Count',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  }
];

const sharedAuthorsColumns = [
  {
    title: 'PMID',
    dataIndex: 'PMID',
    key: 'PMID',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'Authors',
    dataIndex: 'Authors',
    key: 'Authors',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  }
];

const transferredBioEntitiesColumns = [
  {
    title: 'Mention',
    dataIndex: 'Mention',
    key: 'Mention',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'Count',
    dataIndex: 'Count',
    key: 'Count',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
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
      this.setState({ papersMoved2C: res.results[0].count });
      console.log("papersMoved2C results DONE");
      console.log(res.results[0].count);
    })

    getBioentitiesMoved2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ bioentitiesMoved2c: res.results });
      console.log("bioentitiesMoved2c results DONE");
      console.log(res.results);
    })

    getMovement2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ movement2c: res.results[0].Count });
      console.log("movement2c results DONE");
      console.log(res.results[0].Count);
    })

    getSharedBioentities2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ sharedBioentities2c: res.results });
      console.log("sharedBioentities2c results DONE");
      console.log(res.results);
    })

    getPapersBoth2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ papersBoth2c: res.results });
      console.log("papersBoth2c results DONE");
      console.log(res.results);
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
        <Row className='d-flex justify-content-around mt-5'>
            <h4>Papers Country 1 lost to Country 2: {this.state.papersMoved2C}</h4>
        </Row>
        <Row className='d-flex justify-content-around mb-4'>
            <h4>Net migration from Country 1 to Country 2: {this.state.movement2c}</h4>
        </Row>
        <Row className='d-flex justify-content-around'>
          <Col>
            <div style={{ width: '20vw', margin: '0 auto', marginTop: '5vh' }}>
              <h4>Top Shared BioEntities: They are researched in both countries</h4>
              <Table rowKey="Mention" dataSource={this.state.sharedBioentities2c} columns={sharedBioEntitiesColumns} pagination={{ simple: true, pageSizeOptions: [5, 10], defaultPageSize: 10, showQuickJumper: false }} />
            </div>
          </Col >
          <Col>
            <div style={{ width: '20vw', margin: '0 auto', marginTop: '5vh' }}>
              <h4>Top BioEntities transferred from Country 1 to Country 2</h4>
              <Table rowKey="Mention" dataSource={this.state.bioentitiesMoved2c} columns={transferredBioEntitiesColumns} pagination={{ simple: true, defaultPageSize: 10, showQuickJumper: false }} />
            </div>
          </Col>
          <Col>
            <div style={{ width: '20vw', margin: '0 auto', marginTop: '5vh' }}>
              <h4>Papers with authors who studied/worked in both countries</h4>
              <Table rowKey="PMID" dataSource={this.state.papersBoth2c} columns={sharedAuthorsColumns} pagination={{ simple: true, pageSizeOptions: [5, 10], defaultPageSize: 10, showQuickJumper: false }} />
            </div>
          </Col>

        </Row>

      </div>
    )
  }
}

export default TwoCountriesPage

