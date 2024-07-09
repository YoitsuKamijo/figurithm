import React, { useState, useEffect } from "react";
type BarPropType = { num: number; lit?: boolean };

const Bar: React.FC<BarPropType> = ({ num, lit = false }: BarPropType) => {
  return <div style={{ backgroundColor: lit ? "white" : "green" }}>{num}</div>;
};

export default Bar;
