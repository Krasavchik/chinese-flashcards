var React = require('react')
var ReactDOM = require('react-dom')

const Pinyin = React.createClass({
    render: function() {
        return <li className="list-group-item text-xs-center">
            <h2 className="text-muted">
                {this.props.pinyin}
            </h2>
        </li>;
    }
});

const Mute = React.createClass({
    render: function() {
        return <ul className="list-group list-group-flush">
            <li className="list-group-item text-xs-center text-primary">
                <h1 className="text-primary">
                    {this.props.way ? this.props.traduction : this.props.ideogram}
                </h1>
            </li>
            {this.props.way ? '' : ( this.props.is_pinyin ? <Pinyin pinyin={this.props.pinyin} /> : '' ) }
        </ul>;
    }
});

const Solution = React.createClass({
    render: function() {
        return <ul className="list-group list-group-flush">
            <li className="list-group-item text-xs-center">
                <h1 className="text-success">
                    {this.props.way ? this.props.ideogram : this.props.traduction }
                </h1>
            </li>
            {this.props.is_pinyin ? <Pinyin pinyin={this.props.pinyin} /> : '' }
        </ul>;
    }
});

const Flashcards = React.createClass({

    getInitialState: function(){

        var index = Math.floor(Math.random()*words.length);

        var returnState = {
            current: index,
            count: 1,
            learn: true ,
            ideogram: words[index].ideogram ,
            pinyin: words[index].pinyin ,
            traduction: words[index].traduction ,
            way: true ,
            prior_target: words[index].last_try,
            is_sound: true ,
            is_pinyin : true
        } ;

        return returnState;
    },

    componentDidMount: function(){
        key( 'right', this.nextword );
        key( 'space', this.switchcard );
        key( 'left', this.backIt );
        key( 'enter', this.sayWord );
    },

    changeWay: function() {
        this.setState({ way: !this.state.way });
    },

    backIt: function() {
        if ( !this.state.learn ) {
            this.setState({ learn: true });
        }
    },

    sayWord: function() {
        try {
            if ( this.state.is_sound ) {
                var msg = new SpeechSynthesisUtterance();
                msg.text = this.state.ideogram ;
                msg.lang = 'zh-CN' ;
                window.speechSynthesis.speak(msg);
            }
        }
        catch (e) {
           console.log(e);
        }
    },

    proba: function(a){
        var pr = Math.random();
        //console.log(pr);
        if ( pr < a ) {
            return true;
        } else {
            return false;
        }
    },

    treemodel: function(ind){
        var word = words[ind];
        //console.log(word.last_try);
        //console.log(word.type);
        //console.log(this.state.count - word.last_show);

        if ( word.last_try == "new" ){
            //console.log("root node new")
            return true;
        }

        if ( word.last_try == "skip" ){
            //console.log("root node skip");
            return this.proba(0.03);
        }

        if ( word.last_try == "show" || "new" ){

            if ( word.type == "adverbe" || word.type == "idiome" || word.type == "pronom interrogatif" ) {

                var duration = this.state.count - word.last_show;

                if ( duration >= 14) {
                    //console.log("node 1.1.1");
                    return this.proba(0.74);
                }

                else {
                    return this.proba(0.33);
                    //console.log("node 1.1.2");
                }

            } else {
                //console.log("node 1.2");
                return this.proba(0.31);
            }
        }

    },

    skip: function(){
        if( words[this.state.current].last_try != "new" ){
            ga('send', {
                     hitType: 'event',
                     eventCategory: 'Model#1result',
                     eventAction: 'show'
               });
        }
        words[this.state.current].last_try = "skip";
        this.nextword();
    },

    switchcard: function(){

        if ( this.state.learn ) {

            this.setState({
                learn: false
            });

            this.sayWord();

            if( words[this.state.current].last_try != "new" ){
                ga('send', {
                         hitType: 'event',
                         eventCategory: 'Model#1result',
                         eventAction: 'show'
                   });
            }

            words[this.state.current].last_try = "show";

        } else {

            this.nextword();

        }

    },

    changeWay: function(){
        this.setState({ way: !this.state.way });
    },

    toggleAudio: function(){
        this.setState({ is_sound: !this.state.is_sound });
    },

    togglepinyin: function(){
        this.setState({ is_pinyin: !this.state.is_pinyin });
    },

    nextword: function(){

        this.setState({
            count: this.state.count + 1,
        });

        var el = words[this.state.current];

        var prior_target = this.state.prior_target;

        el.count = el.count + 1;

        var show = false;

        while(show == false){
            index = Math.floor(Math.random()*words.length);
            show = this.treemodel(index);
            //console.log(show ? "%cshow" : "%cskip", "color: green; font-size:15px;");
        }

        this.setState({
            current: index,
            learn: true ,
            ideogram: words[index].ideogram ,
            pinyin: words[index].pinyin ,
            traduction: words[index].traduction ,
            prior_target: words[index].last_try
        });

       el.last_show = this.state.count;

    },

    render: function() {
        return <div className="container">
            <div className="row">
                <div className="col-lg-4 col-lg-offset-4 text-xs-center">
                    <label className="c-input c-checkbox">
                        <input type="checkbox" checked={this.state.is_sound} onChange={this.toggleAudio}/>
                        <span className="c-indicator"></span>
                        <small className= "text-muted">
                            <i className="fa fa-volume-up" aria-hidden="true"></i> Prononciation audio
                        </small>
                    </label>
                    <label className="c-input c-checkbox">
                        <input type="checkbox" checked={this.state.is_pinyin} onChange={this.togglepinyin}/>
                        <span className="c-indicator"></span>
                        <small className= "text-muted">
                            Afficher Phonétique
                        </small>
                    </label>
                </div>
            </div>
            <br/>
            <div className="row">
                <div className="col-lg-4 col-lg-offset-4">
                    <div className={ this.state.learn ? 'animated fadeIn card' : 'card hidden-xs-up' }>
                        <div className="card-header text-xs-center">
                            Traduction ?
                        </div>
                        <Mute ideogram={this.state.ideogram} pinyin={this.state.pinyin} traduction={this.state.traduction} way={this.state.way} is_pinyin={this.state.is_pinyin}/>
                        <div className="card-block">
                            <div className="row button_zone">
                                <div className="col-xs-6">
                                    <a href="#" className="btn btn-info btn-block" onClick={this.skip}>
                                        Passer
                                    </a>
                                </div>
                                <div className="col-xs-6">
                                    <a href="#" className="btn btn-primary btn-block" onClick={this.switchcard}>
                                        Solution
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={ this.state.learn ? 'card hidden-xs-up' : 'card' }>
                        <div className="card-header text-xs-center">
                            Solution
                        </div>
                        <Solution ideogram={this.state.ideogram} pinyin={this.state.pinyin} traduction={this.state.traduction} way={this.state.way} is_pinyin={this.state.is_pinyin} />
                        <div className="card-block">
                            <a href="#" className="btn btn-primary btn-block" onClick={this.nextword}>
                                Mot suivant ↦
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 col-lg-offset-4 text-xs-center text-muted">
                    <small>
                        Dans quel sens souhaitez vous apprendre ?
                    </small>
                    <br/>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 col-lg-offset-4 text-xs-center">
                    <label className="c-input c-radio">
                    <input id="radio1" name="radio" type="radio" checked={this.state.way} onChange={this.changeWay} />
                    <span className="c-indicator"></span>
                        <small>Français ↦ Chinois</small>
                    </label>
                    <label className="c-input c-radio">
                    <input id="radio2" name="radio" type="radio" checked={!this.state.way} onChange={this.changeWay} />
                    <span className="c-indicator"></span>
                        <small>Chinois ↦ Français</small>
                    </label>
                </div>
            </div>
        </div>;
    }
});

ReactDOM.render(
    <Flashcards />,
    document.getElementById('app')
);
