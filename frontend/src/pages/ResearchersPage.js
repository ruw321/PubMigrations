import React from 'react';
import {
  Table,
  // Pagination,
  Select,
  Row,
  Col,
  // Divider
} from 'antd'
import { Form, FormInput, FormGroup, Button } from "shards-react";

import MenuBar from '../components/MenuBar';
import { getResearchers } from '../fetcher'

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
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  {
    title: 'BeginYear',
    dataIndex: 'BeginYear',
    key: 'BeginYear',
    // sorter: (a, b) => a.Potential - b.Potential
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

      education: "",
      employment: "",
      pmid: "",
      // organization: null,
      researchersResults: []  
    }

  }

  handlePmidChange(event) {
    this.setState({ pmid: event.target.value })
  }

  handleEmploymentChange(event) {
    this.setState({ employment: event.target.value })
  }

  handleEducationChange(event) {
    this.setState({ education: event.target.value })
  }

  updateSearchResults() {
    getResearchers(this.state.employment, this.state.education, this.state.pmid).then( res => {
        this.setState({ researchersResults: res.results })
    })
    console.log(this.researchersResults);
    console.log('Done updating search results');
  }

  componentDidMount() {

    getResearchers().then(res => {
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
                    <FormInput placeholder="andid" value={this.state.andid} onChange={this.handleEmploymentChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Education</label>
                    <FormInput placeholder="pmid" value={this.state.pmid} onChange={this.handleEducationChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Paper ID (PMID)</label>
                    <FormInput placeholder="AuOrder" value={this.state.auOrder} onChange={this.handlePmidChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Researchers</h3>
        <Table dataSource={this.state.researchersResults} columns={researchersColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default ResearchersPage

