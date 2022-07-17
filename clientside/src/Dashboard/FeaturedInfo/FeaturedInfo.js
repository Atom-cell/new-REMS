import "./featuredinfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

export default function FeaturedInfo() {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Total Employees</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">10</span>
          {/* <span className="featuredMoneyRate">
            -11.4 <ArrowDownward className="featuredIcon negative" />
          </span> */}
        </div>
        <span className="featuredSub">Currently Working </span>
        <span> 3</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Projects</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">20</span>
          <span className="featuredMoneyRate">
            +2 <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Total Hours Worked</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">30:25 hrs </span>
          <span className="featuredMoneyRate">
            -11.4{" "}
            <ArrowDownward
              className="featuredIcon negative"
              style={{ fill: "red" }}
            />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}
