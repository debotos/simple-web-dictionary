import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import me from '../assets/me.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      englishSearch: true,
      loading: false,
      searchingFor: null,
      switchBtnStatus: 'Searching English To Bangla'
    };
  }
  handleFormSubmit = e => {
    e.preventDefault();
    let word = this.state.searchingFor;
    if (this.state.englishSearch) {
      axios
        .get(`/api/exact/eTob/${word}`)
        .then(res => {
          this.setState({ data: res.data });
          this.setState({ loading: false });
          console.log(res.data);
        })
        .catch(err => console.log('Error data Request!', err));
    } else {
      axios
        .get(`/api/exact/bToe/${word}`)
        .then(res => {
          this.setState({ data: res.data });
          this.setState({ loading: false });
          console.log(res.data);
        })
        .catch(err => console.log('Error data Request!', err));
    }
  };
  handleOnChangeInput = e => {
    let input = e.target.value.trim();
    if (input) {
      this.setState({ loading: true });
      this.setState({ searchingFor: e.target.value });
      this.wordSearch();
    } else {
      this.setState({ data: null });
    }
  };
  wordSearch = _.debounce(() => {
    this.searchStart(this.state.searchingFor);
  }, 300);
  searchStart = word => {
    if (this.state.englishSearch) {
      axios
        .get(`/api/eTob/${word}`)
        .then(res => {
          this.setState({ data: res.data });
          this.setState({ loading: false });
          console.log(res.data);
        })
        .catch(err => console.log('Error data Request!', err));
    } else {
      axios
        .get(`/api/bToe/${word}`)
        .then(res => {
          this.setState({ data: res.data });
          this.setState({ loading: false });
          console.log(res.data);
        })
        .catch(err => console.log('Error data Request!', err));
    }
  };
  handleSwitchButton = () => {
    if (this.state.englishSearch) {
      this.setState({ switchBtnStatus: 'Searching Bangla To English' });
      this.setState({ englishSearch: false });
    } else {
      this.setState({ switchBtnStatus: 'Searching English To Bangla' });
      this.setState({ englishSearch: true });
    }
  };
  generateList = () => {
    if (this.state.data && this.state.data.length > 0) {
      return this.state.data.map((singleItem, index) => {
        return (
          <div key={index} className="list-item">
            <div className="firstEntry">
              <h5>{singleItem.eng}</h5>
              <h5>{singleItem.bangla}</h5>
            </div>

            <div className="secondEntry">
              {singleItem.tr && <h5>Uttering: {singleItem.tr}</h5>}
              {singleItem.def && (
                <h5>
                  Defination:<hr />
                  {singleItem.def
                    .slice(1, singleItem.def.length - 1)
                    .split(',')
                    .map((singleItem, index) => (
                      <p key={index}>
                        {index +
                          1 +
                          '. ' +
                          singleItem.slice(1, singleItem.length - 1)}
                      </p>
                    ))}
                </h5>
              )}
              {singleItem.ant && (
                <h5>
                  Antonym:<hr />
                  {singleItem.ant
                    .slice(1, singleItem.ant.length - 1)
                    .split(',')
                    .map((singleItem, index) => (
                      <span style={{ marginRight: '5px' }} key={index}>
                        {singleItem.slice(1, singleItem.length - 1) + ';'}
                      </span>
                    ))}
                </h5>
              )}
            </div>

            <div className="thirdEntry">
              {singleItem.exm && (
                <h5>
                  Example: <hr />
                  {singleItem.exm.indexOf('[') < 0
                    ? singleItem.exm
                    : singleItem.exm.slice(2, singleItem.exm.length - 2)}
                </h5>
              )}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div>
          {this.state.searchingFor ? (
            <h4 style={{ fontWeight: 200, opacity: 0.7 }}>Nothing Found!</h4>
          ) : null}
        </div>
      );
    }
  };
  render() {
    return (
      <div className="App">
        <button className="switch-button" onClick={this.handleSwitchButton}>
          {this.state.switchBtnStatus}
        </button>
        <form
          autoComplete="off"
          noValidate
          className="inputSearchBoxWrapper"
          onSubmit={this.handleFormSubmit}
        >
          <input
            className="inputSearchBox"
            name="inputSearchBox"
            type="text"
            placeholder={
              this.state.englishSearch
                ? 'Search English Word...'
                : 'Search Bangla Word...'
            }
            onChange={this.handleOnChangeInput}
          />
          <br />
        </form>
        <div className="ProfileContainer" style={{ position: 'relative' }}>
          <div className="ProfileShadow" />
          <a
            className="myPhotoLink"
            href="https://www.github.com/debotos"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="myPhoto"
              alt="About me"
              title="Show Profile"
              src={me}
            />
          </a>
        </div>
        {this.state.loading ? (
          <div>
            <div className="searching-loader">
              <div className="searching-loader-inner">
                <div className="searching-loader-line-wrap">
                  <div className="searching-loader-line" />
                </div>
                <div className="searching-loader-line-wrap">
                  <div className="searching-loader-line" />
                </div>
                <div className="searching-loader-line-wrap">
                  <div className="searching-loader-line" />
                </div>
                <div className="searching-loader-line-wrap">
                  <div className="searching-loader-line" />
                </div>
                <div className="searching-loader-line-wrap">
                  <div className="searching-loader-line" />
                </div>
              </div>
            </div>
            <h4
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1rem',
                fontFamily: 'Lato'
              }}
            >
              Searching Words....
            </h4>
          </div>
        ) : (
          <div>
            <div className="content-container">
              <div className="list-body slideInUp">{this.generateList()}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
