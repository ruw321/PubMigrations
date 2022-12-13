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
import { getResearchers } from '../fetcher'

const researchersColumns = [
  {
    title: 'ANDID',
    dataIndex: 'ANDID',
    key: 'ANDID',
    sorter: (a, b) => a.ANDID - b.ANDID
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'LastName',
    dataIndex: 'LastName',
    key: 'LastName',
    sorter: (a, b) => a.LastName.localeCompare(b.LastName)
  },
  {
    title: 'Initials',
    dataIndex: 'Initials',
    key: 'Initials',
    sorter: (a, b) => a.Initials.localeCompare(b.Initials)
  },
  {
    title: 'BeginYear',
    dataIndex: 'BeginYear',
    key: 'BeginYear',
    sorter: (a, b) => a.BeginYear - b.BeginYear
  },
  {
    title: 'Employment',
    dataIndex: 'Employment',
    key: 'Employment',
    sorter: (a, b) => a.Employment.localeCompare(b.Employment)
  },
  {
    title: 'Education',
    dataIndex: 'Education',
    key: 'Education',
    sorter: (a, b) => a.Education.localeCompare(b.Education)
  },
  {
    title: 'Papers',
    dataIndex: 'Papers',
    key: 'Papers',
    sorter: (a, b) => a.Papers.localeCompare(b.Papers)
  }
];

class ResearchersPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,

      education: '',
      employment: '',
      pmid: '',
      researchersResults: []  
    }

    this.handlePmidChange = this.handlePmidChange.bind(this);
    this.handleEmploymentChange = this.handleEmploymentChange.bind(this);
    this.handleEducationChange = this.handleEducationChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);

  }

  handlePmidChange(event) {
    this.setState({ pmid: event.target.value });
    // console.log(this.state.pmid);
  }

  handleEmploymentChange(event) {
    this.setState({ employment: event.target.value });
    // console.log(this.state.employment);
  }

  handleEducationChange(event) {
    this.setState({ education: event.target.value });
    // console.log(this.state.education);
  }

  updateSearchResults() {
    // console.log("here1");
    console.log(this.state.education);
    console.log(this.state.pmid);
    console.log(this.state.employment);
    // console.log("here2");
    
    getResearchers(this.state.employment, this.state.education, this.state.pmid).then( res => {
        this.setState({ researchersResults: res.results })
    })
    // console.log(this.researchersResults);
    // console.log('Done updating search results');
  }

  componentDidMount() {

    getResearchers("", "", "").then(res => {
      console.log(res.results)
      this.setState({ researchersResults: res.results})
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
                    <label>Employment</label>
                    <FormInput placeholder="Employment" value={this.state.employment} onChange={this.handleEmploymentChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Education</label>
                    <FormInput placeholder="Education" value={this.state.education} onChange={this.handleEducationChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Paper ID (PMID)</label>
                    <FormInput placeholder="PMID" value={this.state.pmid} onChange={this.handlePmidChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Researchers</h3>
        <Table rowKey="ANDID" dataSource={this.state.researchersResults} columns={researchersColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 10, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default ResearchersPage

