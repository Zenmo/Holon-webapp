import React, { PureComponent } from "react";
import Button from "../../components/Button";
import RawHtml from "../../components/RawHtml";
import i18n from "../../i18n";
import { basePageWrap } from "../BasePage";

// import i18n from '../../i18n';
// import PropTypes from 'prop-types';
import styles from "./WordCountPage.module.css";

class WordCountPage extends PureComponent {
  state = {};

  static defaultProps = {};

  static propTypes = {};

  handleWordCountClick = () => {
    const quickAndDirtyWordCount = this.props.richText
      .replace(/<[^>]+>/g, " ")
      .split(" ")
      .filter((x) => x).length;

    alert(`This article contains ${quickAndDirtyWordCount} words`);
  };

  render() {
    const { richText } = this.props;
    return (
      <div className={styles.WordCountPage}>
        <div className={[styles.Section, styles.SectionBody]}>
          <RawHtml html={richText} />
        </div>
        <div className={[styles.Section, styles.SectionButton]}>
          <Button text={i18n.t("wordcountpage.buttonText")} onClick={this.handleWordCountClick} />
        </div>
      </div>
    );
  }
}

WordCountPage.propTypes = {};

WordCountPage.defaultProps = {};

export default basePageWrap(WordCountPage);
