import React, { useEffect, useState } from "react";
import "./DashboardWidget.css";
import { Card, Col, Row, Collapse } from "antd";

const DashboardWidget = () => {
  return (
    <div className="container" style={{ marginTop: '20px', marginBottom: '20px' }}>
      <Row >
        <Col xs={24} sm={24} md={8} lg={8} style={{paddingBottom:'12px'}}>
          <Card title="DAILY COMMITMENT" style={{ height: '100%',borderRadius:0}}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} style={{display:'flex',flexDirection:'column',flexWrap:'wrap',justifyContent:'space-between'}}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{marginBottom:'16px',marginLeft:"0px",marginRight:"0px"}}>
            <Col xs={24} sm={24} md={12} lg={12} style={{paddingBottom:'12px'}}>
              <Card title="RENEWALS" style={{ width: '100%', height: 250,borderRadius:0}}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} style={{paddingBottom:'12px',paddingLeft:'0px',paddingRight:'0px'}}>
              <Card title="CFR" style={{ width: "100%", height: 250,borderRadius:0 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col
            xs={24} sm={24} md={12} lg={12}
            style={{paddingBottom:'12px'}}
              // style={{ paddingRight: "12px" }}
            >
              <Card
                title="MY APPLICATIONS"
                style={{ width: "100%", height: 250,borderRadius:0 }}
              >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} style={{paddingBottom:'12px',paddingLeft:'0px',paddingRight:'0px'}}>
              <Card title="BIRTHDAYS" style={{ width: "100%", height: 250,borderRadius:0 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} style={{paddingBottom:'12px'}} >
              <Card title="MY BUSINESS" style={{ width: "100%", height: 300,borderRadius:0 }}>
                <p>
                  Card content Card contentCard contentCard contentCard content
                  Card contentCard content Card content
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} >
            <Card
              title="MY COMMISSIONS"
              style={{ width: "100%", height: 300,borderRadius:0 }}
            >
              <p>
                Card content Card contentCard contentCard contentCard content
                Card contentCard content Card content
              </p>
            </Card>
          </Col>
          </Row>
          
        </Col>
      </Row>
    </div>
  );
};

export default DashboardWidget;
