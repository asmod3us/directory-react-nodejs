var Header = React.createClass({
    render: function () {
        return (
            <header className="bar bar-nav">
                <a href="#" className={"icon icon-left-nav pull-left" + (this.props.back==="true"?"":" hidden")}></a>
                <h1 className="title">{this.props.text}</h1>
            </header>
        );
    }
});

var SearchBar = React.createClass({
    searchHandler: function() {
        this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
    },
    render: function () {
        return (
            <div className="bar bar-standard bar-header-secondary">
                <input type="search" ref="searchKey" onChange={this.searchHandler} value={this.props.searchKey}/>
            </div>

        );
    }
});

var EmployeeListItem = React.createClass({
    render: function () {
        return (
            <li className="table-view-cell media">
                <a href={"#employees/" + this.props.employee.id}>
                    <img className="media-object small pull-left" src={"pics/" + this.props.employee.firstName + "_" + this.props.employee.lastName + ".jpg" }/>
                    {this.props.employee.firstName} {this.props.employee.lastName}
                    <p>{this.props.employee.title}</p>
                </a>
            </li>
        );
    }
});

var EmployeeList = React.createClass({
    render: function () {
        var items = this.props.employees.map(function (employee) {
            return (
                <EmployeeListItem key={employee.id} employee={employee} />
            );
        });
        return (
            <ul  className="table-view">
                {items}
            </ul>
        );
    }
});

var HomePage = React.createClass({
    componentDidMount: function() {
        console.debug('HomePage mounted');
    },

    render: function () {
        return (
            <div className={"page " + this.props.position}>
                <Header text="Employee Directory" back="false"/>
                <SearchBar searchKey={this.props.searchKey} searchHandler={this.props.searchHandler}/>
                <div className="content">
                    <EmployeeList employees={this.props.employees}/>
                </div>
            </div>
        );
    }
});

var EmployeePage = React.createClass({
    getInitialState: function() {
        return {employee: {}};
    },
    componentDidMount: function() {
        console.debug('EmployeePage mounted')

        this.props.service.findById(this.props.employeeId).then(function(result) {
            this.setState({employee: result.data});
        }.bind(this)).done();
    },
    render: function () {
        return (
            <div className={"page " + this.props.position}>
                <Header text="Employee" back="true"/>
                <div className="card">
                    <ul className="table-view">
                        <li className="table-view-cell media">
                            <img className="media-object big pull-left" src={"pics/" + this.state.employee.firstName + "_" + this.state.employee.lastName + ".jpg" }/>
                            <h1>{this.state.employee.firstName} {this.state.employee.lastName}</h1>
                            <p>{this.state.employee.title}</p>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"tel:" + this.state.employee.officePhone} className="push-right">
                                <span className="media-object pull-left icon icon-call"></span>
                                <div className="media-body">
                                Call Office
                                    <p>{this.state.employee.officePhone}</p>
                                </div>
                            </a>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"tel:" + this.state.employee.mobilePhone} className="push-right">
                                <span className="media-object pull-left icon icon-call"></span>
                                <div className="media-body">
                                Call Mobile
                                    <p>{this.state.employee.mobilePhone}</p>
                                </div>
                            </a>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"sms:" + this.state.employee.mobilePhone} className="push-right">
                                <span className="media-object pull-left icon icon-sms"></span>
                                <div className="media-body">
                                SMS
                                    <p>{this.state.employee.mobilePhone}</p>
                                </div>
                            </a>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"mailto:" + this.state.employee.email} className="push-right">
                                <span className="media-object pull-left icon icon-email"></span>
                                <div className="media-body">
                                Email
                                    <p>{this.state.employee.email}</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});

var App = React.createClass({
    mixins: [PageSlider],
    getInitialState: function() {
        return {
            searchKey: '',
            employees: []
        }
    },
    searchHandler: function(searchKey) {
        employeeService.findByName(searchKey).then(function(result) {
            this.setState({
                searchKey:searchKey,
                employees: result.data,
                pages: [<HomePage key="list" searchHandler={this.searchHandler} searchKey={searchKey} employees={result.data}/>]});
        }.bind(this))
        .done();
    },
    componentDidMount: function() {
        router.addRoute('', function() {
            this.slidePage(<HomePage key="list" searchHandler={this.searchHandler} searchKey={this.state.searchKey} employees={this.state.employees}/>);
        }.bind(this));
        router.addRoute('employees/:id', function(id) {
            this.slidePage(<EmployeePage key="details" employeeId={id} service={employeeService}/>);
        }.bind(this));
        router.start();
    }
});

function bootstrap() {
    if (window.cordova) {
        console.debug("Running in Cordova, will bootstrap React once 'deviceready' event fires.");
        document.addEventListener('deviceready', function () {
            console.debug("'deviceready' event has fired, bootstrapping React.");
            React.render(<App/>, document.body);
        }, false);
    } else {
        console.debug("Running in browser, bootstrapping React now.");
        // simple mock for browser environment
        window.cordova = {
            exec: function(success, error, plugin, method, args) {
                success();
            }
        };
        React.render(<App/>, document.body);
    }
}

bootstrap();
