$(document).ready(function () {
    // Append modal HTML to the body once
    $('body').append(`
        <div id="age-verify-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center;">
            <div style="background-color:white; padding:20px; border-radius:8px; max-width:400px; width:100%; text-align:center;">
                <h3>Age Verification</h3>
                <p>Please enter your date of birth:</p>
                <div style="margin-bottom:10px;">
                    <input type="number" id="dob-month" placeholder="MM" min="1" max="12" style="width:60px;" required>
                    <input type="number" id="dob-day" placeholder="DD" min="1" max="31" style="width:60px;" required>
                    <input type="number" id="dob-year" placeholder="YYYY" min="1900" max="2100" style="width:80px;" required>
                </div>
                <button id="age-verify-submit">Submit</button>
                <button id="age-verify-cancel" style="margin-left:10px;">Cancel</button>
                <p id="age-verify-error" style="color:red; display:none;">You must be old enough to view this content.</p>
            </div>
        </div>
    `);

    // Handle button clicks
    $('.age-verify-image').each(function () {
        const container = $(this);
        const ageLimit = parseInt(container.data('age'), 10);
        const imagePlaceholder = container.find('.image-placeholder');
        const verifyButton = container.find('.verify-age-btn');

        verifyButton.on('click', function () {
            // Show modal
            $('#age-verify-modal').fadeIn();

            // Clear previous inputs and errors
            $('#dob-month, #dob-day, #dob-year').val('');
            $('#age-verify-error').hide();

            // Handle modal submission
            $('#age-verify-submit').off('click').on('click', function () {
                const month = parseInt($('#dob-month').val(), 10);
                const day = parseInt($('#dob-day').val(), 10);
                const year = parseInt($('#dob-year').val(), 10);

                if (!month || !day || !year) {
                    $('#age-verify-error').text('Please enter a valid date.').show();
                    return;
                }

                const dob = new Date(year, month - 1, day);
                const today = new Date();
                const age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();

                // Adjust age if birthday hasn't happened yet this year
                const exactAge = m < 0 || (m === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;

                if (exactAge >= ageLimit) {
                    $('#age-verify-modal').fadeOut();
                    verifyButton.remove();
                    imagePlaceholder.show();
                } else {
                    $('#age-verify-error').text(`You must be at least ${ageLimit} years old.`).show();
                }
            });

            // Handle cancel button
            $('#age-verify-cancel').off('click').on('click', function () {
                $('#age-verify-modal').fadeOut();
            });
        });
    });
});
