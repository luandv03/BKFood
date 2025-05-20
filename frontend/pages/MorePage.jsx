import ExternalLink from "../components/ExternalLink";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import "./MorePage.css";

/**
 * MorePage - displays additional options and information
 */
function MorePage() {
    return (
        <ThemedView className="more-page">
            <ThemedText type="heading" className="page-title">
                More Options
            </ThemedText>

            <div className="more-options-container">
                <ThemedView className="more-option-card">
                    <ThemedText type="defaultSemiBold">About Us</ThemedText>
                    <ThemedText>
                        Learn more about BKTable4U and our mission.
                    </ThemedText>
                </ThemedView>

                <ThemedView className="more-option-card">
                    <ThemedText type="defaultSemiBold">
                        Help & Support
                    </ThemedText>
                    <ThemedText>
                        Need help? Contact our support team.
                    </ThemedText>
                </ThemedView>

                <ThemedView className="more-option-card">
                    <ThemedText type="defaultSemiBold">
                        Terms & Conditions
                    </ThemedText>
                    <ThemedText>Read our terms and conditions.</ThemedText>
                </ThemedView>

                <ThemedView className="more-option-card">
                    <ThemedText type="defaultSemiBold">
                        Privacy Policy
                    </ThemedText>
                    <ThemedText>Learn how we protect your data.</ThemedText>
                </ThemedView>

                <ThemedView className="more-option-card">
                    <ThemedText type="defaultSemiBold">Contact</ThemedText>
                    <ThemedText>
                        Email:{" "}
                        <ExternalLink href="mailto:support@bktable4u.com">
                            support@bktable4u.com
                        </ExternalLink>
                    </ThemedText>
                </ThemedView>
            </div>
        </ThemedView>
    );
}

export default MorePage;
