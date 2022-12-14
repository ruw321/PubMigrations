import React from 'react';
import {
  Table,
  Row,
  Col,
  Spin,
} from 'antd'
import { Form, FormInput, FormGroup, Button } from "shards-react";


import MenuBar from '../components/MenuBar';
import { getPaperWords } from '../fetcher';

const bioEntitiesColumns = [
  {
    title: 'PMID',
    dataIndex: 'PMID',
    key: 'PMID',
    sorter: (a, b) => a.PMID - b.PMID
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'TermsFound',
    dataIndex: 'TermsFound',
    key: 'TermsFound',
    sorter: (a, b) => a.TermsFound.localeCompare(b.TermsFound)
  },
  {
    title: 'Count',
    dataIndex: 'Count',
    key: 'Count',
    sorter: (a, b) => a.Count - b.Count
  }
];

class BioEntitiesSearcherPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      pagination: null,

      loadingBioEntities: true,
      wordsList: "brain,neurology",
      bioEntitiesResults: []  
    }

    this.handleWordsListQueryChange = this.handleWordsListQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)

  }

  handleWordsListQueryChange(event) {
    this.setState({ wordsList: event.target.value })
  }

  updateSearchResults() {
    this.setState({ loadingBioEntities: true })
    getPaperWords(this.state.wordsList,
      null, null).then( res => {
        this.setState({ bioEntitiesResults: res.results })
        this.setState({ loadingBioEntities: false })
    })
    console.log('done with updating search results');

  }

  componentDidMount() {

    getPaperWords(this.state.wordsList, null, null).then(res => {
      console.log(res.results)
      this.setState({ bioEntitiesResults: res.results})
      console.log('set state')
      this.setState({ loadingBioEntities: false })
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
                    <label>Words (Comma Separated)</label>
                    <FormInput placeholder="wordsList" value={this.state.wordsList} onChange={this.handleWordsListQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                </FormGroup></Col>
            </Row>
        </Form>
      <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Bio Entities Searcher</h3>
        <Table bordered loading={{ indicator: <div><Spin size="large" /></div>, spinning:this.state.loadingBioEntities}} dataSource={this.state.bioEntitiesResults} columns={bioEntitiesColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
      </div>
    </div>
    )
  }
}

export default BioEntitiesSearcherPage

