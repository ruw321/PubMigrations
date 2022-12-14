import React from 'react';
import {
  Table,
  Row,
  Col,
  Spin
} from 'antd'
import { Form, FormGroup, Button } from "shards-react";
import Select from 'react-select';

import MenuBar from '../components/MenuBar';
import {
  getPapersMoved2C,
  getBioentitiesMoved2c,
  getMovement2c,
  getSharedBioentities2c,
  getPapersBoth2c,
  getAllCountries,
} from '../fetcher'

const sharedBioEntitiesColumns = [
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

const sharedAuthorsColumns = [
  {
    title: 'PMID',
    dataIndex: 'PMID',
    key: 'PMID',
    sorter: (a, b) => a.PMID - b.PMID
  },
  {
    title: 'Authors',
    dataIndex: 'Authors',
    key: 'Authors',
    sorter: (a, b) => a.Authors.localeCompare(b.Authors),
  }
];

const transferredBioEntitiesColumns = [
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

class TwoCountriesPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,

      countries: [],  
      loadingTopSharedBioEntities: false,
      loadingTopBioEntitiesTransferred: false,
      loadingPapersWithAuthors: false,
      country1: '',
      country2: '',
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

  handleCountry1Change(value) {
    this.setState({ country1: value.value });
  }

  handleCountry2Change(value) {
    this.setState({ country2: value.value });
  }

  updateSearchResults() {
    this.setState({ loadingTopBioEntitiesTransferred: true });
    this.setState({ loadingTopSharedBioEntities: true });
    this.setState({ loadingPapersWithAuthors: true });

    getPapersMoved2C(this.state.country1, this.state.country2).then(res => {
      this.setState({ papersMoved2C: res.results[0].count });
      console.log("papersMoved2C results DONE");
      console.log(res.results[0].count);
    })

    getBioentitiesMoved2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ bioentitiesMoved2c: res.results });
      console.log("bioentitiesMoved2c results DONE");
      console.log(res.results);
      this.setState({ loadingTopBioEntitiesTransferred: false });
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
      this.setState({ loadingTopSharedBioEntities: false });

    })

    getPapersBoth2c(this.state.country1, this.state.country2).then(res => {
      this.setState({ papersBoth2c: res.results });
      console.log("papersBoth2c results DONE");
      console.log(res.results);
      this.setState({ loadingPapersWithAuthors: false });
    })
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
              <Select style={{ width: '20vw', margin: '0 auto' }} defaultValue="" options={this.state.countries} onChange={this.handleCountry1Change}></Select>
            </FormGroup></Col>
            <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
              <label>Country 2</label>
              <Select style={{ width: '20vw', margin: '0 auto' }} defaultValue="" options={this.state.countries} onChange={this.handleCountry2Change}></Select>
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
              <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingTopSharedBioEntities}} rowKey="Mention" dataSource={this.state.sharedBioentities2c} columns={sharedBioEntitiesColumns} pagination={{ simple: true, pageSizeOptions: [5, 10], defaultPageSize: 10, showQuickJumper: false }} />
            </div>
          </Col >
          <Col>
            <div style={{ width: '20vw', margin: '0 auto', marginTop: '5vh' }}>
              <h4>Top BioEntities transferred from Country 1 to Country 2</h4>
              <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingTopBioEntitiesTransferred}} rowKey="Mention" dataSource={this.state.bioentitiesMoved2c} columns={transferredBioEntitiesColumns} pagination={{ simple: true, defaultPageSize: 10, showQuickJumper: false }} />
            </div>
          </Col>
          <Col>
            <div style={{ width: '20vw', margin: '0 auto', marginTop: '5vh' }}>
              <h4>Papers with authors who studied/worked in both countries</h4>
              <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingPapersWithAuthors}} rowKey="PMID" dataSource={this.state.papersBoth2c} columns={sharedAuthorsColumns} pagination={{ simple: true, pageSizeOptions: [5, 10], defaultPageSize: 10, showQuickJumper: false }} />
            </div>
          </Col>

        </Row>

      </div>
    )
  }
}

export default TwoCountriesPage

