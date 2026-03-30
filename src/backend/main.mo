import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor {
  type AppointmentRequest = {
    patientName : Text;
    phoneNumber : Text;
    serviceType : Text;
    timestamp : Time.Time;
  };

  module AppointmentRequest {
    public func compare(a : AppointmentRequest, b : AppointmentRequest) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let requests = List.empty<AppointmentRequest>();

  public shared ({ caller }) func bookAppointment(patientName : Text, phoneNumber : Text, serviceType : Text) : async () {
    let newRequest : AppointmentRequest = {
      patientName;
      phoneNumber;
      serviceType;
      timestamp = Time.now();
    };
    requests.add(newRequest);
  };

  public query ({ caller }) func getAllRequests() : async [AppointmentRequest] {
    requests.toArray().sort();
  };
};
