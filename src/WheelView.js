import React from 'react';
import { connect } from 'react-redux';
import { Winwheel } from './Winwheel.js';

class WheelView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinningWheel: null,
            canvasWidth: 100,
            canvasHeight: 100
        }
        this.wheelCanvasRow = React.createRef();

    }

    segmentTextColors = ['#fff'];
    segmentBackgroundColor = '#e95420'

    getCanvasContext = () => document.getElementById('wheel-canvas').getContext('2d');

    componentDidMount = () => {
        let canvasHeight = this.wheelCanvasRow.current.offsetHeight > this.wheelCanvasRow.current.offsetWidth ?
            this.wheelCanvasRow.current.offsetWidth : this.wheelCanvasRow.current.offsetHeight;
        this.setState({ canvasWidth: this.wheelCanvasRow.current.offsetWidth, canvasHeight:  canvasHeight});
    }

    componentDidUpdate = () => {
        if (this.state.spinningWheel === null) {
            const spinnerSegments = [];
            let colorIndex = null;
            const nextTextColor = () => {
                if (colorIndex == null) {
                    colorIndex = Math.floor(Math.random() * this.segmentTextColors.length);
                } else {
                    colorIndex = colorIndex + 1 >= this.segmentTextColors.length ? 0 : colorIndex + 1;
                }
                return colorIndex;
            };

            let placesNames = this.props.places.map(place => place.name);

            placesNames.forEach((place) => {
                const segment = {
                    fillStyle: this.segmentBackgroundColor,
                    text: place,
                    textFillStyle: this.segmentTextColors[nextTextColor()],
                };

                spinnerSegments.push(segment);
            });

            const alertPrize = () => {
                const winningSegment = spinningWheel.getIndicatedSegment();
                alert(`You have won ${winningSegment.text}!`);
            };

            let spinningWheel = new Winwheel({
                canvasId: 'wheel-canvas',
                numSegments: spinnerSegments.length,
                responsive: true,
                segments: spinnerSegments,
                animation:
                {
                    // Must be specified...
                    type: 'spinToStop',
                    duration: 5,
                    spins: 5,
                    easing: 'Power4.easeOut',
                    stopAngle: null,
                    direction: 'clockwise',
                    repeat: 0,
                    yoyo: false,
                    callbackAfter: this.drawTriangle,
                    callbackFinished: alertPrize,
                },
            });

            this.setState({ 'spinningWheel': spinningWheel });

            this.drawTriangle();
        }
    }

    spinWheel = () => {
        this.state.spinningWheel.startAnimation();
    }

    resetWheel = () => {
        this.state.spinningWheel.stopAnimation(false);
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.spinningWheel.rotationAngle = 0;
        this.state.spinningWheel.draw();
        this.drawTriangle();
    }

    drawTriangle = () => {
        const tx = this.getCanvasContext();
        const xPoint = tx.canvas.width / 2;
        const yPoint = 25;
        tx.strokeStyle = '#000000';
        tx.fillStyle = 'aqua';
        tx.lineWidth = 2;
        tx.beginPath();
        tx.moveTo(xPoint - 10, 0);
        tx.lineTo(xPoint + 10, 0);
        tx.lineTo(xPoint, yPoint);
        tx.lineTo(xPoint - 9, 0);
        tx.stroke();
        tx.fill();
    };


    render() {
        return (
            <div class="container-fluid" style={{ height: '100%' }}>
                <div class="row align-items-center justify-content-center no-gutters" style={{ height: '60%' }} ref={this.wheelCanvasRow}>
                    <div class="col align-self-center" >
                        <canvas id='wheel-canvas' ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} />
                    </div>
                </div>
                <div class="row justify-content-center" style={{ height: '30%' }}>
                    <div class="col-sm-2">
                        <button id="spin-button" type="button" style={{ width: '100%' }} class="btn btn-primary" onClick={this.spinWheel}>Spin the wheel!</button>
                    </div>
                    <div class="col-sm-2">
                        <button id="reset-button" type="button" style={{ width: '100%' }} class="btn btn-primary" onClick={this.resetWheel}>Reset</button>
                    </div>
                </div>
            </div>
        );

    }
};
export default connect(state => ({ places: state.placesList.places }))(WheelView);