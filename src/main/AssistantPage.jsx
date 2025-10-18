import PageLayout from '../common/components/PageLayout';
import SettingsMenu from '../settings/components/SettingsMenu';
import useSettingsStyles from '../settings/common/useSettingsStyles';

const AssistantPage = () => {
  const { classes: settingsClasses } = useSettingsStyles();

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['menuAssistant']}>
      <div
        className={settingsClasses.container}
        style={{
          margin: 0,
          padding: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className={settingsClasses.header}
          style={{
            flex: '0 0 auto',
            padding: '10px 20px',
            fontSize: '1rem',
          }}
        >
          {/* هدر شما */}
        </div>

        <div
          style={{
            flex: '1 1 auto',
            width: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
          }}
        >
          <iframe
            src="http://192.168.1.108:3001/home"
            title="External Page"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              minHeight: '300px', // برای موبایل
            }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AssistantPage;
